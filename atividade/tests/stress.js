import http from 'k6/http';
import { check } from 'k6';

export const options = {
	stages: [
		{ duration: '2m', target: 200 },
		{ duration: '2m', target: 500 },
		{ duration: '2m', target: 1000 }
	],
	noConnectionReuse: true,
};

export default function stress () {
	const response = http.post('http://localhost:3000/checkout/crypto', null, {
		headers: { 'Content-Type': 'application/json' }
	});

	check(response, {
		'status 201': (res) => res.status === 201,
		'payload seguro': (res) => res.json('status') === 'SECURE_TRANSACTION',
	});

	if (response.timings.duration > 1000) {
		console.log(`Temos latencia alta: ${response.timings.duration.toFixed(2)}ms`);
	}
}
