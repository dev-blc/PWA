#!/bin/bash

anvil &
ANVIL_PID=$!
echo $ANVIL_PID
cd ./contracts
forge script ./script/e2e.s.sol --rpc-url http://localhost:8545 --broadcast
cd ../

supabase stop
supabase start
supabase db reset --local
#npx playwright test --debug
npx playwright test
supabase stop
kill $ANVIL_PID
