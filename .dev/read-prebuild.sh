#! /usr/bin/env bash
read -s -n 1 choice
if [[ $choice == 'y' || $choice == 'Y' ]]; then
		yarn prebuild:$1
fi
