import http from 'k6/http';
import { check } from 'k6';

export const options = {
	stages: [
		{ duration: '30s', target: 10 },
		{ duration: '10s', target: 300 },
		{ duration: '1m', target: 300 },
		{ duration: '5s', target: 10 },
	],
};

export default function spike () {
	const payload = JSON.stringify({
		cartId: Math.floor(Math.random() * 100000),
		total: 149.9,
		currency: 'BRL',
	});

	const response = http.post('http://localhost:3000/checkout/simple', payload, {
		headers: { 'Content-Type': 'application/json' }
	});

	check(response, {
		'status 201': (res) => res.status === 201,
		'payload aprovado': (res) => res.json('status') === 'APPROVED',
	});

	if (response.timings.duration > 500) {
		console.log(`Temos pico de acesso: ${response.timings.duration.toFixed(2)}ms`);
	}
}
