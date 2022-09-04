import { QrcodeModel } from '.';
import { describe, expect, it } from 'vitest';
describe(QrcodeModel.name, () => {
  describe('given "https://example.com" as text', () => {
    it('encodes successfully', () => {
      const qr = QrcodeModel.encodeText('https://example.com', QrcodeModel.Ecc.MEDIUM);
      expect(qr.size).toEqual(25);
      expect(qr.mask).toEqual(0);
      expect(qr.errorCorrectionLevel).toEqual(QrcodeModel.Ecc.QUARTILE);
      expect(qr.version).toEqual(2);
      for (let y = 0; y < qr.size; y++) {
        for (let x = 0; x < qr.size; x++) {
          expect(qr.getModule(x, y)).toMatchSnapshot();
        }
      }
    });
  });
});
