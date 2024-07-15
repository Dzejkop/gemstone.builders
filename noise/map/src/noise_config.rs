use std::path::Path;

use noise::N;
use serde::{Deserialize, Serialize};

pub fn load_config(path: impl AsRef<Path>) -> anyhow::Result<NoiseConfig> {
    let config = std::fs::read_to_string(path)?;
    let config: NoiseConfig = toml::from_str(&config)?;
    Ok(config)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoiseConfig {
    pub octaves: Vec<NoiseOctave>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoiseOctave {
    pub scale: N,
    pub z_layer: N,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deserialize() {
        const S: &str = indoc::indoc! {r#"
            [[octaves]]
            scale = "1e-10"
            z_layer = "0.1"

            [[octaves]]
            scale = "1e-2"
            z_layer = "0.9"
        "#};

        let config: NoiseConfig = toml::from_str(S).unwrap();

        assert_eq!(config.octaves.len(), 2);
    }
}
