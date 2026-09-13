#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
project_root=$(pwd)
cd "$project_root/workbench"
npm test
