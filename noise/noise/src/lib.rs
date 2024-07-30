use fixed::types::I64F64;

pub type N = I64F64;

pub mod map;
pub mod perm;
pub mod simplex;

#[cfg(feature = "js")]
pub mod js;
