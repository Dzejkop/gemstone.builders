use noise::{simplex, N};
use risc0_zkvm::guest::env;

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

fn main() {
    // read the input
    let x: noise::N = env::read();
    let y: noise::N = env::read();

    let mut output = [0u8; 8 * 8];

    let max = N::from_num(i64::MAX);

    for ox in 0..8 {
        for oy in 0..8 {
            let mut n = N::ZERO;

            let d = N::ONE / N::from_num(8);

            for octave in 0..8 {
                let sx = (x + N::from_num(ox)) / max;
                let sy = (y + N::from_num(oy)) / max;
                let sz = N::ONE / (octave + 1);
                let v = simplex(&PERM, sx, sy, sz);

                n += v * d;
            }

            // Bring from -1..1 to 0..1
            let n = (n / 2).to_num::<f32>() + 0.5;

            let v = (n * 255.0) as u8;
            output[ox * 8 + oy] = v;
        }
    }

    // WIP: We're commiting the sum instead of the output
    //      because it's not straightforward to commit an array
    let sum = output.iter().fold(0, |acc, &x| acc + x as u32);
    env::commit(&sum);
}
