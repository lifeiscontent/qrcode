import { QrcodeModel } from '.';
import { describe, expect, it } from 'vitest';
describe(QrcodeModel.name, () => {
  describe(QrcodeModel.encodeText.name, () => {
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

  describe(QrcodeModel.encodeBinary.name, () => {
    describe('given d1 50 01 00 00 00 f6 5f 05 2d 8f 0b 40 e2 01 as binary', () => {
      it('encodes successfully', () => {
        const qr = QrcodeModel.encodeBinary(
          [
            0xd1, 0x50, 0x01, 0x00, 0x00, 0x00, 0xf6, 0x5f, 0x05, 0x2d, 0x8f, 0x0b, 0x40, 0xe2,
            0x01,
          ],
          QrcodeModel.Ecc.MEDIUM
        );
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
});

export {};
