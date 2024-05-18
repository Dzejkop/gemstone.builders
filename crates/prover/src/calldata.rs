use serde::{Deserialize, Serialize};

use crate::abi::Factory;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalldataRaw(pub ([String; 2], [[String; 2]; 2], [String; 2], [String; 7]));

impl CalldataRaw {
    pub fn to_step_call(&self) -> anyhow::Result<Factory::stepCall> {
        let calldata = &self.0;

        Ok(Factory::stepCall {
            pa: [calldata.0[0].parse()?, calldata.0[1].parse()?],
            pb: [
                [calldata.1[0][0].parse()?, calldata.1[0][1].parse()?],
                [calldata.1[1][0].parse()?, calldata.1[1][1].parse()?],
            ],
            pc: [calldata.2[0].parse()?, calldata.2[1].parse()?],
            publicInputs: [
                calldata.3[0].parse()?,
                calldata.3[1].parse()?,
                calldata.3[2].parse()?,
                calldata.3[3].parse()?,
                calldata.3[4].parse()?,
                calldata.3[5].parse()?,
                calldata.3[6].parse()?,
            ],
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = indoc::indoc! {r#"["0x1f1be4c9befd52dd76a45babf52cdca8749f4c31e41e2567f89e01664664e0e5", "0x096cc295b412ccf3f8d56d6cb24173cfe635e04f1131d01ff2f384982b6e0e34"],[["0x19df061491df2c2625fd4255d92209647ddd1aeca8574f472c71f81fb6815fa4", "0x2ff3fcade9d98315e1eefc2df64df8f79720a6d018ceb4867e68a8ae981d3dfd"],["0x252526f2b4e47ea5069be8fa8d1f2021e492e96aad429059bd1e988a181a1e17", "0x0daf2438d76d4c50ad591508d90650f473fbb22b28f0b2be82be85c30f8a9adb"]],["0x0a72bc1cb1112bf0ce2a55a6f95734bf9bd8daa8e1619a5b96c7e1cd601888e6", "0x025dd8ce6fc1dc56a3ebf10c212a84f2551d62a0ed1d5e5b023c30ca41331a6a"],["0x17c242005c65149a741860ca3117635bee4e5e95547be68f010d183d6e238ce1","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x1f3fde233544f53b47e48c3a58f70028e742b1a4487d61d3c407d7acba28d813","0x2b42128d30056a45fc11b7ee56b9825eedbbfc27a65730dc7abd545344a78e74","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]"#};

    #[test]
    fn parse_sample() {
        let in_brackets = format!("[{}]", SAMPLE);

        let _parsed: CalldataRaw = serde_json::from_str(&in_brackets).unwrap();
    }
}
