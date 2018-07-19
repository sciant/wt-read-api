#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the testrpc instance that we started (if we started one and if it's still running).
  if [ -n "$testrpc_pid" ] && ps -p $testrpc_pid > /dev/null; then
    kill -9 $testrpc_pid
  fi
}

testrpc_port=8545

testrpc_running() {
  nc -z localhost "$testrpc_port"
}

start_testrpc() {
  # We define 2 accounts, DAO and default Hotel Manager
  # with balance lots of ether, needed for high-value tests.
  # Available Accounts - on a clean network
  # =======================================
  # (0) 0x87265a62c60247f862b9149423061b36b460f4bb
  # (1) 0xb99c958777f024bc4ce992b2a0efb2f1f50a4dcf
  #
  local accounts=(
    --account="0xe8280389ca1303a2712a874707fdd5d8ae0437fab9918f845d26fd9919af5a92,10000000000000000000000000000000000000000000000000000000000000000000000000000000"
    --account="0xa4605db83bb3e663f33fb92542ca38344bd8d1bf2d07cc6cc908fec87b7674d5,10000000000000000000000000000000000000000000000000000000000000000000000000000000"
  )

  node_modules/.bin/ganache-cli -i 77 --gasLimit 6000000 "${accounts[@]}"
  testrpc_pid=$!
  sleep 1
}

if testrpc_running; then
  echo "Using existing testrpc instance"
else
  echo "Starting our own testrpc instance"
  start_testrpc
fi
