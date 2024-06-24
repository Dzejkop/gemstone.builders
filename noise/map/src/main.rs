use std::path::PathBuf;

use clap::Parser;
use image::RgbImage;
use noise::{perm, N};
use noise_config::load_config;
use rand::SeedableRng;

mod noise_config;

#[derive(Debug, Parser)]
#[clap(rename_all = "kebab-case")]
struct Args {
    #[clap(short, long, default_value = "56")]
    scale_exp: u8,

    #[clap(short, long, default_value = "1024")]
    image_size: u32,

    #[clap(short, long, default_value = "0")]
    offset: String,

    #[clap(short = 'O', long, default_value = "output.png")]
    output: PathBuf,

    #[clap(long, default_value = "noise.toml")]
    config: PathBuf,
}

fn main() -> anyhow::Result<()> {
    let args = Args::parse();

    let mut img = RgbImage::new(args.image_size, args.image_size);

    let mut rng = rand::rngs::SmallRng::seed_from_u64(42);
    let perm = perm(&mut rng);

    println!("perm = {perm:?}");

    let offset: N = args
        .offset
        .parse()
        .map_err(|err| anyhow::anyhow!("Failed to parse offset: {}", err))?;

    let max = N::from_num(i64::MAX);

    let config = load_config(&args.config)?;

    for (x, y, p) in img.enumerate_pixels_mut() {
        let x = N::from_num(x) + offset;
        let y = N::from_num(y) + offset;
        let x = x / max;
        let y = y / max;

        let mut n = N::ZERO;
        let d = N::ONE / N::from_num(config.octaves.len());

        for octave in &config.octaves {
            let sx = x * octave.scale;
            let sy = y * octave.scale;
            let sz = octave.z_layer;
            let v = noise::simplex(&perm, sx, sy, sz);

            n += v * d;
        }

        // Bring from -1..1 to 0..1
        let n = (n / 2).to_num::<f32>() + 0.5;

        let v = (n * 255.0) as u8;
        *p = image::Rgb([v, v, v]);
    }

    img.save(&args.output)?;

    Ok(())
}
