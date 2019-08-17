const assert = require('assert');
const faker = require('faker');
const { Nilsimsa } = require('../lib/nilsimsa');

// ensure faker consistent data accross runs
faker.seed(123);

describe('Sample Digests', function() {
	// see samples here https://asecuritysite.com/encryption/nil
	const str1 = 'The quick brown fox';
	const str2 = 'The quicker brown fox';

	const expected_digest1 = '0a31b4be01a0808a29e0ec60e9a258545dc0526770022348380a2128708f2fdb';
	const expected_digest2 = '1a31bc3e02a080a28b642864ea224857ddd0526f78022b48380e2269329d3fdb';

	describe('digest', () => {
		it('should return standard digest values', () => {
			assert.equal(new Nilsimsa(str1).digest('hex'), expected_digest1);
			assert.equal(new Nilsimsa(str2).digest('hex'), expected_digest2);
		});

		it('should return the same digest value for the same input', () => {
			const random_str = faker.lorem.word(50); // 50 random words

			assert.equal(new Nilsimsa(random_str).digest('hex'), new Nilsimsa(random_str).digest('hex'));
		});

		it('should allow computing a hash over multiple updates', () => {
			const str1_part1 = 'The quick ';
			const str1_part2 = 'brown fox';
			const nilsimsa = new Nilsimsa();

			nilsimsa.update(str1_part1);
			nilsimsa.update(str1_part2);

			assert.equal(nilsimsa.digest('hex'), expected_digest1);
		});

		it('should allow getting a digest in multiple encoding', () => {
			const expected_digest_base64 = Buffer.from(expected_digest1, 'hex').toString('base64');

			assert.equal(new Nilsimsa(str1).digest('base64'), expected_digest_base64);
		});
	});

	describe('compare', () => {
		// see here https://asecuritysite.com/encryption/nil
		const expected_score = 91;

		const all_1s = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
		const all_0s = '0000000000000000000000000000000000000000000000000000000000000000';

		it('return a standard score', () => {
			assert.equal(Nilsimsa.compare(expected_digest1, expected_digest2), expected_score);
		});

		it('should return 128 for identical input', () => {
			assert.equal(Nilsimsa.compare(expected_digest1, expected_digest1), 128);
			assert.equal(Nilsimsa.compare(expected_digest2, expected_digest2), 128);
			assert.equal(Nilsimsa.compare(all_1s, all_1s), 128);
			assert.equal(Nilsimsa.compare(all_0s, all_0s), 128);
		});

		it('should return -128 for digest with no common bits', () => {
			assert.equal(Nilsimsa.compare(all_1s, all_0s), -128);
		});

		describe('validation', () => {
			it('should throw if 2 digests are not the same binary length', () => {
				const digest1 = 'aaaaaaa';
				const digest2 = 'bbb';

				assert.throws(() => {
					Nilsimsa.compare(digest1, digest2);
				});
			});

			it('should throw if the digests are not 256 bits in length', () => {
				let digest1, digest2;

				// identical, but shorter than 256 bits
				digest1 = expected_digest1.substr(0, 60);
				digest2 = expected_digest1.substr(0, 60);

				assert.throws(() => {
					Nilsimsa.compare(digest1, digest2);
				});

				// identical, but longer than 256 bits
				digest1 = expected_digest1 + 'ab';
				digest2 = expected_digest1 + 'ab';

				assert.throws(() => {
					Nilsimsa.compare(digest1, digest2);
				});
			});
		});

		describe('similarity score against a threshold', () => {
			const expected_similarity_threshold = 54; // proposed in http://spdp.di.unimi.it/papers/pdcs04.pdf

			it('should return a low score for differing input', () => {
				const input1 = faker.lorem.words(100);
				const input2 = faker.lorem.words(100);
				const digest1 = new Nilsimsa(input1).digest('hex');
				const digest2 = new Nilsimsa(input2).digest('hex');

				assert.ok(Nilsimsa.compare(digest1, digest2) < expected_similarity_threshold);
			});

			it('should return a high score for similar input', () => {
				const base_input = faker.lorem.words(100);
				const input1 = 'John, ' + base_input;
				const input2 = 'Timothy, ' + base_input;
				const digest1 = new Nilsimsa(input1).digest('hex');
				const digest2 = new Nilsimsa(input2).digest('hex');

				assert.ok(Nilsimsa.compare(digest1, digest2) >= expected_similarity_threshold);
			});
		});

		describe('multiple encoding', () => {
			it ('should support multiple encoding', () => {
				const digest1_base64 = Buffer.from(expected_digest1, 'hex').toString('base64');
				const digest2_base64 = Buffer.from(expected_digest2, 'hex').toString('base64');

				assert.equal(Nilsimsa.compare(digest1_base64, digest2_base64, 'base64'), expected_score);
			});
		});
	})
});
