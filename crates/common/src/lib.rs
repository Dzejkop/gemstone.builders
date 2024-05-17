use serde::{Deserialize, Serialize};

pub mod buildings;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FactoryBoard(Vec<Vec<u32>>);

pub async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(not(unix))]
    compile_error!("Non UNIX systems not supported");

    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
