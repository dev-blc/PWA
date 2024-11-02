#!/bin/bash

anvil &
ANVIL_PID=$!
echo $ANVIL_PID

cd ./contracts
FORGE_OUTPUT=$(forge script ./script/e2e.s.sol --rpc-url http://localhost:8545 --broadcast)
echo "$FORGE_OUTPUT"

# Extract addresses from deployments.
export POOL_ADDRESS=$(echo "$FORGE_OUTPUT" | grep "Pool deployed at:" | sed 's/.*Pool deployed at: \(0x[a-fA-F0-9]*\)/\1/')
export TOKEN_ADDRESS=$(echo "$FORGE_OUTPUT" | grep "Token deployed at:" | sed 's/.*Token deployed at: \(0x[a-fA-F0-9]*\)/\1/')

echo "Captured POOL_ADDRESS: $POOL_ADDRESS"
echo "Captured TOKEN_ADDRESS: $TOKEN_ADDRESS"
cd ../

pnpx supabase stop
pnpx supabase start
pnpx supabase db reset --local

POOL_ADDRESS=$POOL_ADDRESS TOKEN_ADDRESS=$TOKEN_ADDRESS playwright test
# Debug app in browser.
#POOL_ADDRESS=$POOL_ADDRESS TOKEN_ADDRESS=$TOKEN_ADDRESS playwright test --debug

pnpx supabase stop
kill $ANVIL_PID
