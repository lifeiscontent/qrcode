export class Ecc {
  /*-- Constants --*/

  /**
   * The QR Code can tolerate about  7% erroneous codewords
   */
  public static readonly LOW = new Ecc(0, 1);
  /**
   * The QR Code can tolerate about 15% erroneous codewords
   */
  public static readonly MEDIUM = new Ecc(1, 0);
  /**
   * The QR Code can tolerate about 25% erroneous codewords
   */
  public static readonly QUARTILE = new Ecc(2, 3);
  /**
   * The QR Code can tolerate about 30% erroneous codewords
   */
  public static readonly HIGH = new Ecc(3, 2);

  private constructor(
    /**
     * In the range 0 to 3 (unsigned 2-bit integer).
     */
    public readonly ordinal: number,
    /**
     * (Package-private) In the range 0 to 3 (unsigned 2-bit integer).
     */
    public readonly formatBits: number
  ) {}
}
