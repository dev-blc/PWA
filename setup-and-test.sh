#!/bin/bash

anvil &
ANVIL_PID=$!
echo $ANVIL_PID

cd ./contracts
forge script ./script/e2e.s.sol --rpc-url http://localhost:8545 --broadcast
export NEXT_PUBLIC_NETWORK=local
cd ../

#pnpx supabase stop
#pnpx supabase start
#pnpx supabase db reset --local

playwright test --debug

#pnpx supabase stop
kill $ANVIL_PID
