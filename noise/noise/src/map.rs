use std::hash::{Hash, Hasher};

use twox_hash::XxHash64;

use crate::simplex::simplex;
use crate::N;

const PERM: [usize; 512] = [
    30, 156, 19, 254, 53, 253, 14, 101, 198, 0, 170, 105, 165, 26, 107, 58, 199, 202, 72, 2, 139,
    74, 2, 155, 185, 238, 80, 95, 145, 66, 33, 115, 185, 34, 249, 190, 143, 196, 121, 88, 175, 150,
    174, 219, 89, 13, 140, 131, 183, 84, 215, 175, 207, 190, 187, 49, 158, 153, 114, 157, 67, 75,
    40, 94, 87, 144, 210, 255, 219, 127, 215, 178, 73, 212, 124, 169, 189, 229, 187, 45, 117, 133,
    74, 36, 211, 247, 148, 234, 248, 92, 22, 63, 223, 61, 163, 149, 125, 193, 25, 9, 94, 76, 136,
    21, 146, 255, 208, 241, 154, 119, 40, 180, 205, 226, 141, 78, 159, 234, 24, 134, 110, 221, 8,
    126, 47, 46, 123, 9, 93, 201, 93, 73, 102, 142, 38, 217, 195, 44, 240, 231, 214, 249, 12, 56,
    30, 11, 20, 206, 230, 57, 125, 85, 128, 120, 60, 83, 71, 99, 41, 196, 207, 243, 136, 95, 254,
    28, 65, 3, 29, 45, 130, 216, 250, 84, 32, 56, 245, 179, 237, 204, 200, 98, 210, 33, 111, 192,
    108, 123, 48, 240, 46, 195, 242, 86, 144, 237, 55, 1, 198, 138, 131, 119, 4, 96, 86, 92, 163,
    251, 174, 102, 129, 110, 11, 90, 243, 54, 212, 132, 47, 43, 149, 168, 160, 200, 57, 109, 156,
    62, 238, 23, 203, 59, 79, 135, 182, 247, 77, 103, 241, 114, 127, 191, 176, 122, 117, 216, 242,
    115, 81, 203, 63, 226, 217, 6, 96, 231, 146, 137, 51, 225, 188, 72, 245, 79, 246, 82, 232, 43,
    248, 209, 214, 233, 82, 91, 145, 147, 209, 189, 15, 67, 181, 166, 147, 220, 64, 228, 24, 106,
    140, 109, 54, 53, 39, 224, 199, 168, 162, 220, 222, 184, 153, 70, 32, 121, 71, 89, 228, 17,
    221, 10, 152, 229, 41, 0, 188, 23, 181, 218, 97, 91, 49, 68, 151, 236, 18, 167, 155, 5, 160,
    75, 206, 6, 173, 235, 5, 81, 159, 59, 172, 27, 112, 55, 4, 13, 236, 14, 202, 201, 177, 100, 31,
    16, 157, 100, 111, 178, 128, 66, 162, 69, 142, 97, 7, 173, 3, 25, 35, 62, 134, 152, 251, 44,
    252, 105, 104, 213, 177, 108, 87, 113, 186, 235, 12, 154, 18, 8, 52, 77, 124, 213, 27, 133, 42,
    118, 244, 164, 10, 194, 135, 143, 132, 227, 184, 126, 31, 139, 101, 158, 37, 22, 250, 99, 61,
    171, 227, 70, 204, 246, 218, 112, 69, 167, 80, 164, 50, 21, 106, 36, 225, 224, 118, 179, 180,
    39, 150, 161, 17, 252, 211, 171, 28, 137, 68, 50, 183, 223, 26, 88, 85, 38, 239, 230, 120, 239,
    52, 104, 51, 193, 90, 176, 166, 205, 170, 58, 34, 78, 107, 16, 103, 64, 113, 253, 148, 186,
    169, 98, 222, 15, 29, 192, 197, 1, 233, 65, 42, 165, 172, 141, 208, 35, 244, 197, 191, 60, 130,
    83, 37, 138, 20, 129, 182, 194, 48, 122, 116, 7, 232, 161, 76, 19, 116, 151,
];

/// Base compoments for map data calculation
#[derive(Debug, Clone, Copy)]
pub struct TileNoise {
    pub very_high: f64,
    pub high: f64,
    pub med: f64,
    pub low: f64,
    pub very_low: f64,
    pub biome: f64,
    pub richness: f64,
    pub resources: f64,
}

pub struct TileMetadata {}

pub struct TileResources {
    pub carbon_present: bool,
}

fn random_xxhash(x: i64, y: i64, seed: u64) -> f64 {
    let mut hasher = XxHash64::default();
    (x, y, seed).hash(&mut hasher);
    let hash = hasher.finish();
    (hash as f64) / (std::u64::MAX as f64)
}

pub fn tile_noise(x: i64, y: i64) -> TileNoise {
    let max = N::from_num(i64::MAX);

    let very_high = random_xxhash(x, y, 42);

    // Coords scaled to [0, 1]
    let x = N::from_num(x) / max;
    let y = N::from_num(y) / max;

    let high = ssrm(
        &PERM,
        x,
        y,
        N::ZERO,
        N::from_num(1_000_000_000_000_000_000_i64),
    );
    let med = ssrm(&PERM, x, y, N::ZERO, N::from_num(1_000_000_i64));
    let low = ssrm(&PERM, x, y, N::ZERO, N::from_num(10));
    let very_low = ssrm(&PERM, x, y, N::ZERO, N::from_num(2));

    let biome = ssrm(&PERM, x, y, N::lit("123.923"), N::from_num(7));
    let richness = ssrm(&PERM, x, y, N::lit("1.5"), N::from_num(16));
    let resources = ssrm(&PERM, x, y, N::lit("3.472"), N::from_num(16));

    TileNoise {
        very_high,
        high,
        med,
        low,
        very_low,
        biome,
        richness,
        resources,
    }
}

/// simplex scaled remapped to [0, 1]
fn ssrm(perm: &[usize; 512], x: N, y: N, z: N, scale: N) -> f64 {
    let x = scale * x;
    let y = scale * y;

    let noise = simplex(perm, x, y, z);

    let noise: f64 = noise.to_num();
    let noise = (noise + 1.0) / 2.0;

    noise
}

pub fn tile_metadata(noise: &TileNoise) -> TileMetadata {
    TileMetadata {}
}

pub fn tile_resources(noise: &TileNoise) -> TileResources {
    let TileNoise {
        very_high,
        high,
        med,
        richness,
        ..
    } = noise;

    let offset_richness = richness * 0.7 + 0.2; // Carbon is present almost everywhere

    let carbon_distribution = offset_richness * very_high * high * med;
    let carbon_present = carbon_distribution > 0.3;

    TileResources { carbon_present }
}

#[cfg(test)]
mod tests {
    use std::fs;

    use image::{ImageBuffer, Rgb};

    use super::*;

    #[test]
    fn min_input() {
        let noise = tile_noise(0, 0);
        println!("{:?}", noise);
    }

    #[test]
    fn max_input() {
        let noise = tile_noise(i64::MAX, i64::MAX);
        println!("{:?}", noise);
    }

    fn env_parse<T>(env_name: &str, default: T) -> T
    where
        T: std::str::FromStr,
        T::Err: std::fmt::Debug,
    {
        match std::env::var(env_name) {
            Ok(val) => val
                .parse()
                .expect(&format!("Failed to parse {} env var", env_name)),
            Err(_) => default,
        }
    }

    #[test]
    fn generate_noise_bitmaps() {
        let size: u32 = env_parse("NOISE_BITMAP_SIZE", 512);
        const OUTPUT_DIR: &str = "noise_bitmaps";

        let step = i64::MAX / size as i64;

        // Create output directory if it doesn't exist
        fs::create_dir_all(OUTPUT_DIR).expect("Failed to create output directory");

        let layers: Vec<(&str, fn(&TileNoise) -> f64)> = vec![
            ("very_high", |n: &TileNoise| n.very_high),
            ("high", |n: &TileNoise| n.high),
            ("med", |n: &TileNoise| n.med),
            ("low", |n: &TileNoise| n.low),
            ("very_low", |n: &TileNoise| n.very_low),
            ("biome", |n: &TileNoise| n.biome),
            ("richness", |n: &TileNoise| n.richness),
            ("resources", |n: &TileNoise| n.resources),
        ];

        for (layer_name, get_value) in layers {
            let mut img = ImageBuffer::new(size, size);

            for (x, y, pixel) in img.enumerate_pixels_mut() {
                let noise = tile_noise(x as i64 * step, y as i64 * step);
                let value = get_value(&noise);
                let color = (value * 255.0) as u8;
                *pixel = Rgb([color, color, color]);
            }

            let filename = format!("{}/{}_noise.png", OUTPUT_DIR, layer_name);
            img.save(&filename)
                .expect(&format!("Failed to save {} bitmap", layer_name));
            println!("Saved {} noise bitmap to {}", layer_name, filename);
        }
    }
}
