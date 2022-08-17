import http from 'k6/http';
import { sleep } from 'k6';

// __ENV = process.env

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',

      // Our test should last 30 seconds in total
      duration: '30s',

      // It should start 30 iterations per `timeUnit`. Note that iterations starting points
      // will be evenly spread across the `timeUnit` period.
      rate: 60,

      // It should start `rate` iterations per second
      timeUnit: '1s',

      // It should preallocate 2 VUs before starting the test
      preAllocatedVUs: 2,

      // It is allowed to spin up to 50 maximum VUs to sustain the defined
      // constant arrival rate.
      maxVUs: 50,
    },
  },
};

const host = __ENV.HOST ? 'http://'+__ENV.HOST : "http://localhost"
const port = __ENV.PORT ? __ENV.PORT : "8080"

export function setup() {
	console.log("hitting: " + host + ':' + port + '/');
}


export default function () {
  const params = {
      headers: {
          'Content-Type': 'application/json',
      },
  };

  // http.post(host+':'+port+'/api/items', JSON.stringify({title: "test", body: "test"}), params);
  http.get(host+':'+port+'/');
  // We're injecting a processing pause for illustrative purposes only!
  // Each iteration will be ~515ms, therefore ~2 iterations/second per VU maximum throughput.
  sleep(0.5);
}

