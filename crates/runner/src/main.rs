use std::path::PathBuf;

use clap::Parser;
use wasmer::{imports, Function, FunctionEnv, FunctionEnvMut, Instance, Module, Store, Value};

#[derive(Parser)]
struct Args {
    #[clap(short, long)]
    pub module: PathBuf,
}

fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let args = Args::parse();

    let module_file = std::fs::read(&args.module)?;

    let mut store = Store::default();
    let module = Module::new(&store, &module_file)?;

    // "runtime"."exceptionHandler": [I32] -> []
    // "runtime"."printErrorMessage": [] -> []
    // "runtime"."writeBufferMessage": [] -> []
    // "runtime"."showSharedRWMemory": [] -> []

    let env = FunctionEnv::new(&mut store, ());

    fn exception_handler(_env: FunctionEnvMut<()>, a: i32) -> i32 {
        println!("Calling `multiply_typed`...");
        let result = a * 3;

        println!("Result of `multiply_typed`: {:?}", result);

        result
    }

    fn noop(_env: FunctionEnvMut<()>,) {}

    let exception_handler = Function::new_typed_with_env(&mut store, &env, exception_handler);
    let noop = Function::new_typed_with_env(&mut store, &env, noop);

    let import_object = imports! {
        "runtime" => {
            "exceptionHandler" => exception_handler,
            "printErrorMessage" => noop.clone(),
            "writeBufferMessage" => noop.clone(),
            "showSharedRWMemory" => noop.clone(),
        }
    };


    let instance = Instance::new(&mut store, &module, &import_object)?;

    let add_one = instance.exports.get_function("add_one")?;
    let result = add_one.call(&mut store, &[Value::I32(42)])?;
    assert_eq!(result[0], Value::I32(43));

    Ok(())
}
