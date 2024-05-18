use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use abi::Factory::userBalanceReturn;
use axum::extract::State;
use axum::routing::{get, post};
use axum::{Json, Router};
use clap::Parser;
use game::{Board, GameState, SimulateOutput};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

use crate::app::App;

mod abi;
mod app;
mod calldata;
mod game;
mod hashing;
mod tasks;

pub const STATE_FILE: &str = "game.json";

#[tracing::instrument]
async fn simulate(Json(game): Json<GameState>) -> Json<SimulateOutput> {
    Json(game.advance())
}

#[tracing::instrument(skip(app))]
async fn update_board(State(app): State<Arc<App>>, Json(new_board): Json<Board>) {
    let mut game = app.game.lock().await;

    *game = GameState {
        board: new_board,
        resource_state: game::empty_state(),
    };
}

#[tracing::instrument(skip(app))]
async fn delete_board(State(app): State<Arc<App>>) {
    let mut game = app.game.lock().await;
    *game = GameState::empty();
}

#[tracing::instrument(skip(app))]
async fn get_board(State(app): State<Arc<App>>) -> Json<GameState> {
    let game = app.game.lock().await;

    Json(game.clone())
}

#[tracing::instrument(skip(app))]
async fn get_balance(State(app): State<Arc<App>>) -> Json<Vec<u64>> {
    let balance = app.get_balance().await.unwrap();
    Json(balance)
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
        // default_value = "https://ethereum-sepolia.blockpi.network/v1/rpc/public"
        default_value = "http://localhost:8545"
    )]
    pub rpc_url: String,

    #[clap(short, long, default_value = "./state")]
    pub state_dir: PathBuf,

    #[clap(short, long, env, default_value = "./circuit.wasm")]
    pub circuit_wasm: PathBuf,

    #[clap(short, long, env, default_value = "./key.zkey")]
    pub zkey: PathBuf,

    // Default value is first default anvil key
    #[clap(
        short,
        long,
        env,
        default_value = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    )]
    pub private_key: String,

    #[clap(
        short,
        long,
        env,
        default_value = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    )]
    pub factory_address: String,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let args = Args::parse();

    let working_dir = std::env::current_dir();
    tracing::info!(?working_dir, "Prover starting");

    tokio::fs::create_dir_all(&args.state_dir).await?;

    let state_file = args.state_dir.join(STATE_FILE);
    let game_state = if tokio::fs::try_exists(&state_file).await? {
        let state = tokio::fs::read(&state_file).await?;
        serde_json::from_slice(&state)?
    } else {
        GameState::empty()
    };

    let addr = args.addr;
    let app = Arc::new(App {
        args,
        is_running: AtomicBool::new(true),
        game: Mutex::new(game_state),
    });

    app.cache_state().await?;

    let app_clone = app.clone();
    tokio::task::spawn(async move {
        tasks::main_loop(app_clone).await.unwrap();
    });

    let router = Router::new()
        .route("/simulate", post(simulate))
        .route(
            "/board",
            get(get_board).post(update_board).delete(delete_board),
        )
        .route("/game/start", post(start_game))
        .route("/game/stop", post(stop_game))
        .route("/balance", get(get_balance))
        .with_state(app.clone())
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind(addr).await?;

    tracing::info!(?addr, "Listening");

    axum::serve(listener, router)
        .with_graceful_shutdown(common::shutdown_signal())
        .await?;

    Ok(())
}
