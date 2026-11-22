#!/usr/bin/env bash
set -e

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm use --silent
exec node dist/lib/index.js
