import http from 'k6/http';
import { check } from 'k6';

export const options = {
	vus: 1,
	duration: '30s',
	thresholds: {
		http_req_failed: ['rate==0']
	},
};

export default function() {
	const response = http.get(`http://localhost:3000/health`);

	check(response, {
		'status 200': (res) => res.status === 200,
		'payload com status UP': (res) => res.json('status') === 'UP',
	});
}
