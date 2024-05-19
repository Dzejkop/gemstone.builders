### Base stage
FROM debian:12 as base

WORKDIR /src

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    curl build-essential \
    libssl-dev texinfo \
    libcap2-bin pkg-config \
    npm

# TODO: Use a specific version of rustup
# Install rustup
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Set environment variables
ENV PATH="/root/.cargo/bin:${PATH}"
ENV RUSTUP_HOME="/root/.rustup"
ENV CARGO_HOME="/root/.cargo"

# Install the toolchain
RUN rustup component add cargo

# Install cargo chef
RUN cargo install cargo-chef --locked

### Recipe cooking stage
FROM base as build-env-base
WORKDIR /src

# Copy everything
COPY . .

# Prepare the recipe
RUN cargo chef prepare --recipe-path recipe.json

### Build stage
FROM base as build-env
WORKDIR /src

# Copy recipe
COPY --from=build-env-base /src/recipe.json ./recipe.json

# Copy just the crates
COPY crates/ crates/

# Build the dependencies
RUN cargo chef cook --release --recipe-path ./recipe.json

# Copy the remaining source code
COPY . .

ARG BIN=prover

# Build the binary
RUN cargo build --release --bin $BIN --no-default-features

# Make sure it runs
RUN /src/target/release/$BIN --version

### Runtime stage
FROM debian:12-slim

WORKDIR /app

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Install snarkjs via npm
RUN npm install -g snarkjs

ARG BIN=prover

# Copy the binary
COPY --from=build-env /src/target/release/$BIN /usr/local/bin/app

# Copy artifacts
COPY --from=build-env /src/circuit_artifacts/key.zkey /app/key.zkey
COPY --from=build-env /src/circuit_artifacts/assembly5.wasm /app/assembly5.wasm

ENV ZKEY="/app/key.zkey"
ENV CIRCUIT_WASM="/app/assembly5.wasm"
ENV STATE_DIR=/app/state

VOLUME /app/state

ENTRYPOINT [ "/usr/local/bin/app" ]
