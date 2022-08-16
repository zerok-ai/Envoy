function run {
    cd $1
    ./run.sh
    cd ..
}

function clean {
    cd $1
    ./clean.sh
    cd ..
}

run expressApp
sleep 5
run envoy
clean taps
sleep 5
run K6 