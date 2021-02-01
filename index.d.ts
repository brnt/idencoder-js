declare module 'idencoder' {
	export class IdEncoder {
		static DEFAULT_ALPHABET: string;
		readonly alphabet: string;
		readonly block_size: number;
		readonly modulus: number;

		constructor(alphabet: string, block_size: number, checksum: number);
		encode(n: bigint, min_length?: number): string;
		decode(s: string): bigint;
	}

	export function encode(n: bigint, min_length?: number): string;
	export function decode(n: string): bigint;
	export function random_alphabet(): string;
}
