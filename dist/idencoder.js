"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random_alphabet = exports.decode = exports.encode = exports.DEFAULT_ENCODER = exports.IdEncoder = void 0;
const DEFAULT_ALPHABET = "ygw96j2cetxuk3fq4rv5z7hsdamn8bp";
const DEFAULT_BLOCK_SIZE = 24;
const DEFAULT_CHECKSUM = 29;
const MIN_LENGTH = 5;
class IdEncoder {
    constructor(alphabet = DEFAULT_ALPHABET, block_size = DEFAULT_BLOCK_SIZE, checksum = DEFAULT_CHECKSUM) {
        this.encode_value = this._scramble;
        this.decode_value = this._scramble;
        if (checksum < 0 || checksum > alphabet.length) {
            throw new Error("Invalid checksum");
        }
        this.alphabet = alphabet;
        this.block_size = block_size;
        this.modulus = checksum;
    }
    encode(n, min_length = MIN_LENGTH) {
        return this.checksum(n) + this.enbase(this.encode_value(n), min_length);
    }
    decode(s) {
        var value = this.decode_value(this.debase(s.slice(1)));
        if (this.checksum(value) != s.slice(0, 1)) {
            throw new Error("Incorrect checksum");
        }
        return value;
    }
    checksum(n) {
        return this.alphabet[Number(BigInt(n) % BigInt(this.modulus))];
    }
    _scramble(n) {
        var mask = (1n << BigInt(this.block_size)) - 1n;
        var result = BigInt(n) & ~mask;
        for (var bit = 0; bit < this.block_size; ++bit) {
            if (BigInt(n) & BigInt(1 << bit)) {
                result |= BigInt(1 << (this.block_size - bit - 1));
            }
        }
        return result;
    }
    enbase(x, min_length = MIN_LENGTH) {
        var n = BigInt(this.alphabet.length);
        var chars = [];
        while (x) {
            var c = Number(x % n);
            x = x / n;
            chars.unshift(this.alphabet[c]);
        }
        var result = chars.join("");
        return result.padStart(min_length, this.alphabet[0]);
    }
    debase(x) {
        var n = BigInt(this.alphabet.length);
        var result = BigInt(0);
        for (var i = 0; i < x.length; ++i) {
            var c = x.charAt(i);
            result = result * n;
            result += BigInt(this.alphabet.indexOf(c));
        }
        return result;
    }
}
exports.IdEncoder = IdEncoder;
exports.DEFAULT_ENCODER = new IdEncoder();
function encode(n, min_length = MIN_LENGTH) {
    return exports.DEFAULT_ENCODER.encode(n, min_length);
}
exports.encode = encode;
function decode(n) {
    return exports.DEFAULT_ENCODER.decode(n);
}
exports.decode = decode;
function random_alphabet() {
    function shuffle(str) {
        var arr = str.split(''); // doesn't work for unicode!!!
        var currentIndex = arr.length, temporaryValue, randomIndex;
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
exports.random_alphabet = random_alphabet;
// This is the equivalent of Python's `if __name__ == "__main__"` construct
if (require.main === module) {
    for (var i = 1; i < 100; ++i) {
        var encoded = encode(BigInt(i));
        console.log(`${i}	${encoded}	${decode(encoded)}`);
    }
}
exports.default = { IdEncoder, encode, decode, random_alphabet };
