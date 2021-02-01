const DEFAULT_ALPHABET:string = "ygw96j2cetxuk3fq4rv5z7hsdamn8bp";
const DEFAULT_BLOCK_SIZE:number = 24;
const DEFAULT_CHECKSUM:number = 29;
const MIN_LENGTH:number = 5;


export class IdEncoder {
	alphabet:string;
	block_size:number;
	modulus:number;

	constructor(alphabet:string=DEFAULT_ALPHABET,
				block_size:number=DEFAULT_BLOCK_SIZE,
				checksum:number=DEFAULT_CHECKSUM) {
		if (checksum < 0 || checksum > alphabet.length) {
			throw new Error("Invalid checksum");
		}
		this.alphabet = alphabet;
		this.block_size = block_size;
		this.modulus = checksum;
	}

	encode(n:bigint, min_length:number=MIN_LENGTH):string {
		return this.checksum(n) + this.enbase(this.encode_value(n), min_length)
	}

	decode(s:string):bigint {
		var value:bigint = this.decode_value(this.debase(s.slice(1)));
		if (this.checksum(value) != s.slice(0,1)) {
			throw new Error("Incorrect checksum");
		}
		return value;
	}

	checksum(n:bigint):string {
		return this.alphabet[Number(BigInt(n) % BigInt(this.modulus))];
	}

	_scramble(n:bigint):bigint {
		var mask:bigint = (1n << BigInt(this.block_size)) - 1n;
		var result:bigint = BigInt(n) & ~mask;

		for (var bit:number=0; bit < this.block_size; ++bit) {
			if (BigInt(n) & BigInt(1 << bit)) {
				result |= BigInt(1 << (this.block_size - bit - 1));
			}
		}
		return result;
	}

	encode_value = this._scramble;
	decode_value = this._scramble;

	enbase(x:bigint, min_length:number=MIN_LENGTH):string {
		var n:bigint = BigInt(this.alphabet.length);
		var chars:string[] = [];
		while (x) {
			var c:number = Number(x % n);
			x = x/n;
			chars.unshift(this.alphabet[c]);
		}
		var result:string = chars.join("");
		return result.padStart(min_length, this.alphabet[0]);
	}

	debase(x:string):bigint {
		var n:bigint = BigInt(this.alphabet.length);
		var result:bigint = BigInt(0);
		for (var i:number = 0; i < x.length; ++i) {
			var c:string = x.charAt(i);
			result = result * n;
			result += BigInt(this.alphabet.indexOf(c));
		}
		return result;
	}
}

export const DEFAULT_ENCODER:IdEncoder = new IdEncoder();


export function encode(n:bigint, min_length=MIN_LENGTH):string {
    return DEFAULT_ENCODER.encode(n, min_length)
}


export function decode(n:string):bigint {
    return DEFAULT_ENCODER.decode(n)
}

export function random_alphabet():string {
	function shuffle(str:string):string {
		var arr:string[] = str.split(''); // doesn't work for unicode!!!
		var currentIndex:number = arr.length,
			temporaryValue:string,
			randomIndex:number;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = arr[currentIndex];
			arr[currentIndex] = arr[randomIndex];
			arr[randomIndex] = temporaryValue;
		}

		return arr.join('');
	}

    return shuffle(DEFAULT_ALPHABET);
}

// This is the equivalent of Python's `if __name__ == "__main__"` construct
if (require.main === module) {
	for (var i:number = 1; i < 100; ++i) {
		var encoded:string = encode(BigInt(i));
		console.log(`${i}	${encoded}	${decode(encoded)}`);
	}
}

export default { IdEncoder, encode, decode, random_alphabet };

