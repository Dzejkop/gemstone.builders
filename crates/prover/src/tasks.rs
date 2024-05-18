use std::path::PathBuf;
use std::sync::atomic::Ordering;
use std::sync::Arc;
use std::time::Duration;

use crate::calldata::CalldataRaw;
use crate::App;

const INPUT_FILE: &str = "input.json";
const WITNESS_FILE: &str = "witness.wtns";
const PROOF_FILE: &str = "proof.json";
const PUBLIC_FILE: &str = "public.json";

const BASE_DIR: &str = ".cache";

pub async fn main_loop(app: Arc<App>) -> anyhow::Result<()> {
    loop {
        let is_running = app.is_running.load(Ordering::Relaxed);

        if !is_running {
            tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            continue;
        }

        let mut game = app.game.lock().await;

        // let temp_working_dir = tempfile::tempdir()?;
        // let working_dir = temp_working_dir.path();

        let f = format!("pass_{}", rand::random::<u64>());
        let working_dir = PathBuf::from(BASE_DIR).join(f);
        tokio::fs::create_dir_all(&working_dir).await?;

        tracing::info!(?working_dir, "Performing step");

        // 1. Construct proof input
        tracing::info!("Constructing prover input");
        let prover_input = game.construct_prover_input()?;

        tracing::info!(board_hash = prover_input.board_hash, "Input ready");

        let input_file_path = working_dir.join(INPUT_FILE);
        let witness_file_path = working_dir.join(WITNESS_FILE);

        let circuit_wasm_path = app.args.circuit_wasm.canonicalize()?;
        let zkey_path = app.args.zkey.canonicalize()?;

        tracing::info!("Writing prover input");
        tokio::fs::write(
            &input_file_path,
            serde_json::to_string_pretty(&prover_input)?,
        )
        .await?;

        tracing::info!("Generating witness");
        let wc_output = tokio::process::Command::new("snarkjs")
            .arg("wc")
            .arg(&circuit_wasm_path)
            .arg(INPUT_FILE)
            .arg(WITNESS_FILE)
            .current_dir(&working_dir)
            .output()
            .await?;

        if !wc_output.status.success() {
            anyhow::bail!(
                "Failed to generate witness: {}",
                String::from_utf8_lossy(&wc_output.stderr)
            );
        }

        tracing::info!("Generating proof");
        let now = std::time::Instant::now();
        let g16p_output = tokio::process::Command::new("snarkjs")
            .arg("g16p")
            .arg(&zkey_path)
            .arg(WITNESS_FILE)
            .arg(PROOF_FILE)
            .arg(PUBLIC_FILE)
            .current_dir(&working_dir)
            .output()
            .await?;

        if !g16p_output.status.success() {
            anyhow::bail!(
                "Failed to generate proof: {}",
                String::from_utf8_lossy(&g16p_output.stderr)
            );
        }

        let proving_time = now.elapsed();
        tracing::info!(?proving_time, "Proof generated");

        tracing::info!("Generate calldata");
        let zkesc_output = tokio::process::Command::new("snarkjs")
            .arg("zkesc")
            .arg(PUBLIC_FILE)
            .arg(PROOF_FILE)
            .current_dir(&working_dir)
            .output()
            .await?;

        if !zkesc_output.status.success() {
            anyhow::bail!(
                "Failed to generate calldata: {}",
                String::from_utf8_lossy(&zkesc_output.stderr)
            );
        }

        let calldata = String::from_utf8_lossy(&zkesc_output.stdout);
        tracing::info!(%calldata, "Calldata");

        let calldata_in_brackets = format!("[{}]", calldata);
        let calldata: CalldataRaw = serde_json::from_str(&calldata_in_brackets)?;

        tracing::info!("Submitting step");
        tokio::time::sleep(Duration::from_secs_f32(0.0)).await;

        tracing::info!("Advancing game");
        *game = game.clone().advance();
    }
}
