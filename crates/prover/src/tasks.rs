use std::sync::atomic::Ordering;
use std::sync::Arc;

use crate::App;

pub async fn main_loop(app: Arc<App>) -> anyhow::Result<()> {
    loop {
        let is_running = app.is_running.load(Ordering::Relaxed);

        if !is_running {
            tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            continue;
        }

        let mut game = app.game.lock().await;

        let prover_input = game.construct_prover_input()?;

        // 1. Construct proof input
        // 2. Generate proof
        // 3. Submit step call with proof
        // 4. Wait for response
        // 5. Advance
    }
}
