#!/bin/bash

# Kill any existing anvil process
pkill anvil

# Esperar un momento para asegurar que el puerto esté libre
sleep 1

anvil &
ANVIL_PID=$!
echo $ANVIL_PID

cd ./contracts
forge script script/e2e.s.sol:E2EScript --rpc-url http://localhost:8545 --broadcast
export NEXT_PUBLIC_NETWORK=local
cd ../

#pnpx supabase stop
#pnpx supabase start
#pnpx supabase db reset --local

playwright test --debug

#pnpx supabase stop
kill $ANVIL_PID
