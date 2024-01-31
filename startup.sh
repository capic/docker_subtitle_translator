#!/bin/bash

# turn on bash's job control
set -m

# Start the primary process and put it in the background
python src/main.py /data/input/ /data/output/ &

# Start the helper process
cd subtitle-translator
npx nx serve server &
NODE_ENV=production npx nx run client:preview --host 0.0.0.0 --disableHostCheck &

# the my_helper_process might need to know how to wait on the
# primary process to start before it does its work and returns


# now we bring the primary process back into the foreground
# and leave it there
fg %1
