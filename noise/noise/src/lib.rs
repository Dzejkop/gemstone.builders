use fixed::types::I64F64;
use rand::Rng;

pub type N = I64F64;

const GRAD3: [[N; 3]; 12] = [
    [N::ONE, N::ONE, N::ZERO],
    [N::NEG_ONE, N::ONE, N::ZERO],
    [N::ONE, N::NEG_ONE, N::ZERO],
    [N::NEG_ONE, N::NEG_ONE, N::ZERO],
    [N::ONE, N::ZERO, N::ONE],
    [N::NEG_ONE, N::ZERO, N::ONE],
    [N::ONE, N::ZERO, N::NEG_ONE],
    [N::NEG_ONE, N::ZERO, N::NEG_ONE],
    [N::ZERO, N::ONE, N::ONE],
    [N::ZERO, N::NEG_ONE, N::ONE],
    [N::ZERO, N::ONE, N::NEG_ONE],
    [N::ZERO, N::NEG_ONE, N::NEG_ONE],
];

fn half() -> N {
    N::ONE / 2
}

fn f3() -> N {
    N::ONE / 3
}

fn g3() -> N {
    N::ONE / 6
}

fn dot(g: &[N; 3], x: N, y: N, z: N) -> N {
    g[0] * x + g[1] * y + g[2] * z
}

pub fn perm(rng: &mut impl Rng) -> [usize; 512] {
    let mut perm = [0; 512];
    for i in 0..512 {
        perm[i] = i % 256;
    }

    use rand::seq::SliceRandom;
    perm.shuffle(rng);

    perm
}

pub fn simplex(perm: &[usize; 512], x: N, y: N, z: N) -> N {
    let s = (x + y + z) * f3();
    let i = (x + s).floor();
    let j = (y + s).floor();
    let k = (z + s).floor();
    let t = (i + j + k) * g3();
    let x0 = x - (i - t);
    let y0 = y - (j - t);
    let z0 = z - (k - t);

    let (i1, j1, k1, i2, j2, k2) = if x0 >= y0 {
        if y0 >= z0 {
            (N::ONE, N::ZERO, N::ZERO, N::ONE, N::ONE, N::ZERO)
        } else if x0 >= z0 {
            (N::ONE, N::ZERO, N::ZERO, N::ONE, N::ZERO, N::ONE)
        } else {
            (N::ZERO, N::ZERO, N::ONE, N::ONE, N::ZERO, N::ONE)
        }
    } else {
        if y0 < z0 {
            (N::ZERO, N::ZERO, N::ONE, N::ZERO, N::ONE, N::ONE)
        } else if x0 < z0 {
            (N::ZERO, N::ONE, N::ZERO, N::ZERO, N::ONE, N::ONE)
        } else {
            (N::ZERO, N::ONE, N::ZERO, N::ONE, N::ONE, N::ZERO)
        }
    };

    let x1 = x0 - i1 + g3();
    let y1 = y0 - j1 + g3();
    let z1 = z0 - k1 + g3();
    let x2 = x0 - i2 + N::from_num(2) * g3();
    let y2 = y0 - j2 + N::from_num(2) * g3();
    let z2 = z0 - k2 + N::from_num(2) * g3();
    let x3 = x0 - N::ONE + N::from_num(3) * g3();
    let y3 = y0 - N::ONE + N::from_num(3) * g3();
    let z3 = z0 - N::ONE + N::from_num(3) * g3();

    let ii = i % 255;
    let jj = j % 255;
    let kk = k % 255;

    // TODO: Do we have to do this?
    let iiu = ii.to_num::<usize>() % 255;
    let jju = jj.to_num::<usize>() % 255;
    let kku = kk.to_num::<usize>() % 255;
    let i1u = i1.to_num::<usize>() % 255;
    let j1u = j1.to_num::<usize>() % 255;
    let k1u = k1.to_num::<usize>() % 255;
    let i2u = i2.to_num::<usize>() % 255;
    let j2u = j2.to_num::<usize>() % 255;
    let k2u = k2.to_num::<usize>() % 255;

    let gi0 = perm[iiu + perm[jju + perm[kku]]] % 12;
    let gi1 = perm[iiu + i1u + perm[jju + j1u + perm[kku + k1u]]] % 12;
    let gi2 = perm[iiu + i2u + perm[jju + j2u + perm[kku + k2u]]] % 12;
    let gi3 = perm[iiu + 1 + perm[jju + 1 + perm[kku + 1]]] % 12;

    let n0 = if (half() - x0 * x0 - y0 * y0 - z0 * z0) < N::ZERO {
        N::ZERO
    } else {
        let t0 = half() - x0 * x0 - y0 * y0 - z0 * z0;
        t0 * t0 * t0 * t0 * dot(&GRAD3[gi0], x0, y0, z0)
    };

    let n1 = if (half() - x1 * x1 - y1 * y1 - z1 * z1) < N::ZERO {
        N::ZERO
    } else {
        let t1 = half() - x1 * x1 - y1 * y1 - z1 * z1;
        t1 * t1 * t1 * t1 * dot(&GRAD3[gi1], x1, y1, z1)
    };

    let n2 = if (half() - x2 * x2 - y2 * y2 - z2 * z2) < N::ZERO {
        N::ZERO
    } else {
        let t2 = half() - x2 * x2 - y2 * y2 - z2 * z2;
        t2 * t2 * t2 * t2 * dot(&GRAD3[gi2], x2, y2, z2)
    };

    let n3 = if (half() - x3 * x3 - y3 * y3 - z3 * z3) < N::ZERO {
        N::ZERO
    } else {
        let t3 = half() - x3 * x3 - y3 * y3 - z3 * z3;
        t3 * t3 * t3 * t3 * dot(&GRAD3[gi3], x3, y3, z3)
    };

    N::from_num(32) * (n0 + n1 + n2 + n3)
}
