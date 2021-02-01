Integer ID Encoder
===================

A Typescript -> Javascript implmentation of the [Python Idencoder
lib](https://github.com/brnt/idencoder). There's a [Go version](https://github.com/brnt/idencoder-go), too!

## Usage
Link to or embed the file `dist/idencoder.js` in your Javascript project, or use `idencoder.ts` directly in your Typescript project.

## Compiling
You'll need node and ts-node installed. Then just run:

```sh
$ tsc
```

The compiled Javascript file will be saved to the `dist` folder. That's it!

## Algorithm details

A bit-shuffling approach is used to avoid generating consecutive, predictable
values. However, the algorithm is deterministic and will guarantee that no
collisions will occur.

The encoding alphabet is fully customizable and may contain any number of
characters. By default, digits and lower-case letters are used, with some
characters removed to avoid confusion between characters like o, O and 0. The
default alphabet is shuffled and has a prime number of characters to further
improve the results of the algorithm.

The block size specifies how many bits will be shuffled. The lower `BLOCK_SIZE`
bits are reversed. Any bits higher than `BLOCK_SIZE` will remain as is.
`BLOCK_SIZE` of 0 will leave all bits unaffected and the algorithm will simply
be converting your integer to a different base.

## Common application

### URL shortening & obfuscation
The intended use is that incrementing, consecutive integers will be used as
keys to generate the encoded IDs. For example, to create a new short URL (à la
bit.ly), the unique integer ID assigned by a database could be used to generate
the last portion of the URL by using this module. Or a simple counter may be
used. As long as the same integer is not used twice, the same encoded value
will not be generated twice.

The module supports both encoding and decoding of values. The `min_length`
parameter allows you to pad the encoded value if you want it to be a specific
length.

## WARNING ###

If you use this library as part of a production system, **you must generate
your own unique alphabet(s).** One alphabet per encoded entity type is
recommended. Best practice is to configure the alphabet(s) as environment
variables (like you do with credentials, right? ;-)) or to use random alphabets
that are re-randomized each time your application is initialized. The latter
approach will result in different encoded values for the same ID each time your
application is initialized, but this may be acceptable.

For convenience, the library includes a `random_alphabet()` function that you
can use to easily generate these unique alphabets.


## TODOs
* Implement command-line options to match the original lib
* Show an example of usage in the README

## Provenance


Original Author (Python): [Michael Fogleman](http://code.activestate.com/recipes/576918/);
License: [MIT](https://opensource.org/licenses/MIT)

Updated module (Python): [Brent Thomson](https://github.com/brnt/idencoder) (source from which this version is ported).

Home for this project: https://github.com/brnt/idencoder-js


