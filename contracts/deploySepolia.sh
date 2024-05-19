# !!! THIS DOESN'T WORK !!!
# !!! RUN EACH STEP MANUALLY !!!

forge create --private-key $PRIV_KEY --verify Factory
forge create --private-key $PRIV_KEY --verify --json Resource --constructor-args Carbon CRBN
forge create --private-key $PRIV_KEY --verify --json Resource --constructor-args Diamon DMND

export FACTORY=x
export CARBON=x
export DIAMOND=x

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
