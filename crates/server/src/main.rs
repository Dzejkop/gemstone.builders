use std::sync::Arc;

use axum::routing::post;
use axum::Router;

struct App {}

async fn whatever() {}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt::init();

    tracing::info!("Server starting");

    let app = Arc::new(App {});

    let router = Router::new()
        .route("/", post(whatever))
        .with_state(app.clone());

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3000));

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, router)
        .with_graceful_shutdown(common::shutdown_signal())
        .await?;

    Ok(())
}
