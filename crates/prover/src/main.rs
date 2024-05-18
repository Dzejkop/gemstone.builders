use std::net::SocketAddr;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use alloy_rpc_client::RpcClient;
use alloy_transport_http::Http;
use axum::extract::State;
use axum::routing::{get, post};
use axum::{Json, Router};
use clap::Parser;
use game::{Board, GameState};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

mod game;

struct App {
    pub is_running: AtomicBool,
    pub game: Mutex<Option<game::GameState>>,
}

#[tracing::instrument]
async fn simulate(Json(game): Json<GameState>) -> Json<GameState> {
    Json(game.advance())
}

#[tracing::instrument(skip(app))]
async fn update_board(State(app): State<Arc<App>>, Json(new_board): Json<Board>) {
    let mut game = app.game.lock().await;

    if let Some(game) = game.as_mut() {
        game.board = new_board;
        game.resource_state = game::empty_state();
    } else {
        *game = Some(GameState {
            board: new_board,
            resource_state: game::empty_state(),
        });
    }
}

#[tracing::instrument(skip(app))]
async fn delete_board(State(app): State<Arc<App>>) {
    let mut game = app.game.lock().await;
    *game = None;
}

#[tracing::instrument(skip(app))]
async fn get_board(State(app): State<Arc<App>>) -> Json<Option<Board>> {
    let game = app.game.lock().await;

    if let Some(game) = game.as_ref() {
        Json(Some(game.board))
    } else {
        Json(None)
    }
}

#[tracing::instrument(skip(app))]
async fn start_game(State(app): State<Arc<App>>) {
    app.is_running.store(true, Ordering::Relaxed);
}

#[tracing::instrument(skip(app))]
async fn stop_game(State(app): State<Arc<App>>) {
    app.is_running.store(true, Ordering::Relaxed);
}

#[derive(Debug, Clone, Parser)]
struct Args {
    #[clap(short, long, default_value = "0.0.0.0:3123")]
    pub addr: SocketAddr,

    #[clap(
        short,
        long,
        default_value = "https://ethereum-sepolia.blockpi.network/v1/rpc/public"
    )]
    pub rpc_url: String,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let args = Args::parse();

    tracing::info!("Prover starting");


    let client = Http::new(args.rpc_url.parse()?);
    let _client: RpcClient<Http<reqwest::Client>> = RpcClient::new(client, false);

    let app = Arc::new(App {
        is_running: AtomicBool::new(false),
        game: Mutex::new(None),
    });

    let router = Router::new()
        .route("/simulate", post(simulate))
        .route(
            "/board",
            get(get_board).post(update_board).delete(delete_board),
        )
        .route("/game/start", post(start_game))
        .route("/game/stop", post(stop_game))
        .with_state(app.clone())
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind(args.addr).await?;

    tracing::info!(addr = ?args.addr, "Listening");

    axum::serve(listener, router)
        .with_graceful_shutdown(common::shutdown_signal())
        .await?;

    Ok(())
}
