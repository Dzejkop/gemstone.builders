Sure, I'll remove the labels and ensure that buildings are nodes as well. Here are the updated diagrams:

# Mining
## Hematite Mining
```mermaid
graph LR
    Mine{{Mine}} --> Hematite([Hematite])
```

## Coal Mining
```mermaid
graph LR
    Mine{{Mine}} --> Coal([Coal])
```

## Quartz Mining
```mermaid
graph LR
    Mine{{Mine}} --> Quartz([Quartz])
```

# Crushing
## Coal Crushing
```mermaid
graph LR
    Coal([Coal]) --> Crusher{{Crusher}} --> CoalDust([Coal Dust])
```

## Hematite Crushing
```mermaid
graph LR
    Hematite([Hematite]) --> Crusher{{Crusher}} --> HematiteGravel([Hematite Gravel])
```

## Quartz Crushing
```mermaid
graph LR
    Quartz([Quartz]) --> Crusher{{Crusher}} --> QuartzGravel([Quartz Gravel])
```

# Sieving
## Iron Sieving
```mermaid
graph LR
    HematiteGravel([Hematite Gravel]) --> Sieve{{Sieve}}
    Sieve{{Sieve}} --> IronDust([Iron Dust])
    Sieve{{Sieve}} --> Rust([Rust])
```

## Quartz Sieving
```mermaid
graph LR
    QuartzGravel([Quartz Gravel]) --> Sieve{{Sieve}}
    Sieve --> Sand([Sand])
    Sieve --> QuartzDust([Quartz Dust])
```

# Mixing
## Amethyst Dust
```mermaid
graph LR
    Mixer{{Mixer}}
    QuartzDust([Quartz Dust]) --> Mixer
    IronDust([Iron Dust]) --> Mixer
    Mixer --> AmethystDust([Amethyst Dust])
```

# Polishing

## Hematite Polishing
```mermaid
graph LR
    Hematite([Hematite]) --> Polisher{{Polisher}}
    Sand([Sand]) --> Polisher
    Polisher -->  PolishedHematite([Polished Hematite])
```

## Diamond Polishing
```mermaid
graph LR
    RoughDiamond([Rough Diamond]) --> Polisher{{Polisher}}
    Sand([Sand]) --> Polisher
    Polisher -->  Diamond([Diamond])
```

# Compression
## Rough Diamond
```mermaid
graph LR
    HydraulicPress{{Hydraulic Press}}
    Fuel([??? Fuel ???]) --> HydraulicPress
    CoalDust([Coal Dust]) --> HydraulicPress
    HydraulicPress --> RoughDiamond([Rough Diamond])
    HydraulicPress --> Residue([??? Residue ???])
```

## Rough Amethyst
```mermaid
graph LR
    HydraulicPress{{Hydraulic Press}}
    Fuel([??? Fuel ???]) --> HydraulicPress
    AmethystDust([Amethyst Dust]) --> HydraulicPress
    HydraulicPress --> RoughAmethyst([Rough Amethyst])
    HydraulicPress --> Residue([??? Residue ???])
```
