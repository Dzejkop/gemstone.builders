
#[cfg(feature = "rand")]
pub fn generate(rng: &mut impl rand::Rng) -> [usize; 512] {
    let mut perm = [0; 512];
    for i in 0..512 {
        perm[i] = i % 256;
    }

    use rand::seq::SliceRandom;
    perm.shuffle(rng);

    perm
}

#[cfg(test)]
mod tests {
    use rand::SeedableRng;

    use super::*;

    #[test]
    fn test_generate() {
        let mut rng = rand::rngs::SmallRng::seed_from_u64(42);
        let perm = generate(&mut rng);

        println!("perm = {:?}", perm);
    }
}