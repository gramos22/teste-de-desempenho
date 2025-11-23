import http from 'k6/http';
import { check } from 'k6';

export const options = {
	stages: [
		{ duration: '1m', target: 50 },
		{ duration: '2m', target: 50 },
		{ duration: '30s', target: 0 },
	],
	thresholds: {
		http_req_duration: ['p(95)<500'],
		http_req_failed: ['rate<0.01']
	},
};

export default function load () {
	const payload = JSON.stringify({
		cartId: Math.floor(Math.random() * 100000),
		total: 199.9,
		currency: 'BRL',
	});

	const response = http.post('http://localhost:3000/checkout/simple', payload, {
		headers: { 'Content-Type': 'application/json' }
	});

	check(response, {
		'status 201': (res) => res.status === 201,
		'payload aprovado': (res) => res.json('status') === 'APPROVED',
	});
}
