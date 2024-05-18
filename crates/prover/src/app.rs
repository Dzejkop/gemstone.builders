use std::str::FromStr;
use std::sync::atomic::AtomicBool;

use alloy::network::EthereumSigner;
use alloy::primitives::Uint;
use alloy::providers::ProviderBuilder;
use alloy::signers::wallet::Wallet;
use tokio::sync::Mutex;

use crate::{
    abi::Factory::{userBalanceCall, userBalanceReturn},
    game, Args, STATE_FILE,
};

pub struct App {
    pub args: Args,
    pub is_running: AtomicBool,
    pub game: Mutex<game::GameState>,
}

impl App {
    #[tracing::instrument(skip_all)]
    pub async fn cache_state(&self) -> anyhow::Result<()> {
        let state_file = self.args.state_dir.join(STATE_FILE);

        let game = self.game.lock().await;
        let state = serde_json::to_string_pretty(&*game)?;

        tokio::fs::write(&state_file, state).await?;

        Ok(())
    }

    #[tracing::instrument(skip_all)]
    pub async fn validate_state(&self) -> anyhow::Result<bool> {
        let game = self.game.lock().await;

        let board_hash = game.board_hash()?;
        let board_hash: Uint<256, 4> = board_hash.parse()?;

        let resource_state_hash = game.resource_state_hash()?;
        let resource_state_hash: Uint<256, 4> = resource_state_hash.parse()?;

        let contract = init_contract!(self);

        let wallet = Wallet::from_str(&self.args.private_key)?;
        let user_factory_hash = contract.factoryHashes(wallet.address()).call().await?._0;

        if user_factory_hash != board_hash {
            tracing::warn!(
                ?user_factory_hash,
                ?board_hash,
                "User factory hash does not match board hash"
            );
            return Ok(false);
        }

        let factory_state_hash = contract.factoryStates(user_factory_hash).call().await?._0;

        if factory_state_hash != resource_state_hash {
            tracing::warn!(
                ?factory_state_hash,
                ?resource_state_hash,
                "Factory state hash does not match resource state hash"
            );
            return Ok(false);
        }

        Ok(true)
    }

    pub async fn get_balance(&self) -> anyhow::Result<Vec<u64>> {
        let wallet = Wallet::from_str(&self.args.private_key)?;
        let contract = init_contract!(self);

        let balance = contract.userBalance(wallet.address()).call().await?;
        let return_balance: Vec<u64> =
            [balance._0[0].as_limbs()[0], balance._0[1].as_limbs()[0]].to_vec();
        Ok(return_balance)
    }

    #[tracing::instrument(skip_all)]
    pub async fn reset_state(&self) -> anyhow::Result<()> {
        let mut game = self.game.lock().await;

        game.resource_state = game::empty_state();

        let board_hash = game.board_hash()?;

        drop(game);
        self.cache_state().await?;

        let contract = init_contract!(self);

        let board_hash: Uint<256, 4> = board_hash.parse()?;

        tracing::warn!(?board_hash, "Resetting");

        let receipt = contract
            .updateFactory(board_hash)
            .send()
            .await?
            .get_receipt()
            .await?;

        if !receipt.status() {
            anyhow::bail!("Failed to update factory state on chain");
        }

        let tx_hash = receipt.transaction_hash;
        tracing::info!(?tx_hash, "Reset successful");

        Ok(())
    }
}

// Macro because type signatures are too long
macro_rules! init_contract {
    ($app:expr) => {{
        let wallet = Wallet::from_str(&$app.args.private_key)?;
        let signer: EthereumSigner = wallet.into();
        let provider = ProviderBuilder::new()
            .with_recommended_fillers()
            .signer(signer)
            .on_http($app.args.rpc_url.parse()?);

        let contract = crate::abi::Factory::new($app.args.factory_address.parse()?, provider);

        contract
    }};
}

pub(crate) use init_contract;
