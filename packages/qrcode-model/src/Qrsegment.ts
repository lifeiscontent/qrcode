import type { bit, byte, int } from './types';
import { appendBits } from './utils';
import { Mode } from './Qrsegment/Mode';

export class Qrsegment {
  public static Mode = Mode;
  /*-- Static factory functions (mid level) --*/

  // Returns a segment representing the given binary data encoded in
  // byte mode. All input byte arrays are acceptable. Any text string
  // can be converted to UTF-8 bytes and encoded as a byte mode segment.
  public static makeBytes(data: readonly byte[]): Qrsegment {
    const bb: bit[] = [];
    for (const b of data) appendBits(b, 8, bb);
    return new Qrsegment(Mode.BYTE, data.length, bb);
  }

  // Returns a segment representing the given string of decimal digits encoded in numeric mode.
  public static makeNumeric(digits: string): Qrsegment {
    if (!Qrsegment.isNumeric(digits))
      throw new RangeError('String contains non-numeric characters');
    const bb: bit[] = [];
    for (let i = 0; i < digits.length; ) {
      // Consume up to 3 digits per iteration
      const n: int = Math.min(digits.length - i, 3);
      appendBits(parseInt(digits.substr(i, n), 10), n * 3 + 1, bb);
      i += n;
    }
    return new Qrsegment(Mode.NUMERIC, digits.length, bb);
  }

  // Returns a segment representing the given text string encoded in alphanumeric mode.
  // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
  // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
  public static makeAlphanumeric(text: string): Qrsegment {
    if (!Qrsegment.isAlphanumeric(text))
      throw new RangeError('String contains unencodable characters in alphanumeric mode');
    const bb: bit[] = [];
    let i: int;
    for (i = 0; i + 2 <= text.length; i += 2) {
      // Process groups of 2
      let temp: int = Qrsegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
      temp += Qrsegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
      appendBits(temp, 11, bb);
    }
    if (i < text.length)
      // 1 character remaining
      appendBits(Qrsegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
    return new Qrsegment(Mode.ALPHANUMERIC, text.length, bb);
  }

  // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
  // The result may use various segment modes and switch modes to optimize the length of the bit stream.
  public static makeSegments(text: string): Qrsegment[] {
    // Select the most efficient segment encoding automatically
    if (text == '') return [];
    else if (Qrsegment.isNumeric(text)) return [Qrsegment.makeNumeric(text)];
    else if (Qrsegment.isAlphanumeric(text)) return [Qrsegment.makeAlphanumeric(text)];
    else return [Qrsegment.makeBytes(Qrsegment.toUtf8ByteArray(text))];
  }

  // Returns a segment representing an Extended Channel Interpretation
  // (ECI) designator with the given assignment value.
  public static makeEci(assignVal: int): Qrsegment {
    const bb: bit[] = [];
    if (assignVal < 0) throw new RangeError('ECI assignment value out of range');
    else if (assignVal < 1 << 7) appendBits(assignVal, 8, bb);
    else if (assignVal < 1 << 14) {
      appendBits(0b10, 2, bb);
      appendBits(assignVal, 14, bb);
    } else if (assignVal < 1000000) {
      appendBits(0b110, 3, bb);
      appendBits(assignVal, 21, bb);
    } else throw new RangeError('ECI assignment value out of range');
    return new Qrsegment(Mode.ECI, 0, bb);
  }

  // Tests whether the given string can be encoded as a segment in numeric mode.
  // A string is encodable iff each character is in the range 0 to 9.
  public static isNumeric(text: string): boolean {
    return Qrsegment.NUMERIC_REGEX.test(text);
  }

  // Tests whether the given string can be encoded as a segment in alphanumeric mode.
  // A string is encodable iff each character is in the following set: 0 to 9, A to Z
  // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
  public static isAlphanumeric(text: string): boolean {
    return Qrsegment.ALPHANUMERIC_REGEX.test(text);
  }

  /*-- Constructor (low level) and fields --*/

  // Creates a new QR Code segment with the given attributes and data.
  // The character count (numChars) must agree with the mode and the bit buffer length,
  // but the constraint isn't checked. The given bit buffer is cloned and stored.
  public constructor(
    // The mode indicator of this segment.
    public readonly mode: Mode,

    // The length of this segment's unencoded data. Measured in characters for
    // numeric/alphanumeric/kanji mode, bytes for byte mode, and 0 for ECI mode.
    // Always zero or positive. Not the same as the data's bit length.
    public readonly numChars: int,

    // The data bits of this segment. Accessed through getData().
    private readonly bitData: bit[]
  ) {
    if (numChars < 0) throw new RangeError('Invalid argument');
    this.bitData = bitData.slice(); // Make defensive copy
  }

  /*-- Methods --*/

  // Returns a new copy of the data bits of this segment.
  public getData(): bit[] {
    return this.bitData.slice(); // Make defensive copy
  }

  // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
  // the given version. The result is infinity if a segment has too many characters to fit its length field.
  public static getTotalBits(segs: readonly Qrsegment[], version: int): number {
    let result = 0;
    for (const seg of segs) {
      const ccbits: int = seg.mode.numCharCountBits(version);
      if (seg.numChars >= 1 << ccbits) return Infinity; // The segment's length doesn't fit the field's bit width
      result += 4 + ccbits + seg.bitData.length;
    }
    return result;
  }

  // Returns a new array of bytes representing the given string encoded in UTF-8.
  private static toUtf8ByteArray(str: string): byte[] {
    str = encodeURI(str);
    const result: byte[] = [];
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) != '%') result.push(str.charCodeAt(i));
      else {
        result.push(parseInt(str.substr(i + 1, 2), 16));
        i += 2;
      }
    }
    return result;
  }

  /*-- Constants --*/

  // Describes precisely all strings that are encodable in numeric mode.
  private static readonly NUMERIC_REGEX: RegExp = /^[0-9]*$/;

  // Describes precisely all strings that are encodable in alphanumeric mode.
  private static readonly ALPHANUMERIC_REGEX: RegExp = /^[A-Z0-9 $%*+.\\/:-]*$/;

  // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.
  private static readonly ALPHANUMERIC_CHARSET: string =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
}
