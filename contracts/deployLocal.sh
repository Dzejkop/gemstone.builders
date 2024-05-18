export PRIV_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export ADDR=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

export FACTORY=`forge create --private-key $PRIV_KEY --json Factory | jq --raw-output .deployedTo`
export CARBON=`forge create --private-key $PRIV_KEY --json Resource --constructor-args Carbon CRBN | jq --raw-output .deployedTo`
export DIAMOND=`forge create --private-key $PRIV_KEY --json Resource --constructor-args Diamon DMND | jq --raw-output .deployedTo`

echo "Registering"
cast send --private-key $PRIV_KEY $FACTORY 'registerResource(uint256,address)' 0 $CARBON
cast send --private-key $PRIV_KEY $FACTORY 'registerResource(uint256,address)' 1 $DIAMOND

echo "Minting"
cast send --private-key $PRIV_KEY $CARBON 'mint(address,uint256)' $ADDR 1000
cast send --private-key $PRIV_KEY $DIAMOND 'mint(address,uint256)' $ADDR 1000

echo "Transferring ownership"
cast send --private-key $PRIV_KEY $CARBON 'transferOwnership(address)' $FACTORY
cast send --private-key $PRIV_KEY $DIAMOND 'transferOwnership(address)' $FACTORY

cast send --private-key $PRIV_KEY $CARBON 'approve(address,uint256)' $FACTORY 1000
cast send --private-key $PRIV_KEY $DIAMOND 'approve(address,uint256)' $FACTORY 1000

cast send --private-key $PRIV_KEY $FACTORY "lock(uint8[2])" '[100, 100]'

echo "FACTORY=$FACTORY"
echo "CARBON=$CARBON"
echo "DIAMOND=$DIAMOND"
