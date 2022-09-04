/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import type { QrcodeModel } from '@lifeiscontent/qrcode-model';
export * from '@lifeiscontent/qrcode-model';

export type QrcodeProps = {
  model: QrcodeModel;
  border?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  renderedAs?: keyof typeof Renderers;
};

const Renderers = {
  rects(model: QrcodeModel, border: number, fill: string) {
    const rects: Required<
      Pick<
        React.SVGAttributes<SVGRectElement>,
        'fill' | 'height' | 'width' | 'x' | 'y' | 'shapeRendering'
      >
    >[] = [];
    for (let y = 0; y < model.size; y++) {
      for (let x = 0; x < model.size; x++) {
        if (model.getModule(x, y)) {
          rects.push({
            fill: fill,
            height: 1,
            width: 1,
            x: x + border,
            y: y + border,
            shapeRendering: 'crispEdges',
          });
        }
      }
    }

    return rects.map((rect) => <rect {...rect} key={`${rect.x}, ${rect.y}`} />);
  },
  path(model: QrcodeModel, border: number, fill: string) {
    const rects: string[] = [];
    for (let y = 0; y < model.size; y++) {
      for (let x = 0; x < model.size; x++) {
        if (model.getModule(x, y)) {
          // M6 5H5V6H6V5Z
          rects.push(
            `M${border + x + 1} ${border + y}H${border + x}V${border + y + 1}H${border + x + 1}V${
              border + y
            }Z`
          );
        }
      }
    }
    return <path shapeRendering="crispEdges" fill={fill} d={`${rects.join(' ')}`} />;
  },
} as const;

export function Qrcode({
  model,
  renderedAs = 'path',
  border = 0,
  foregroundColor = '#000000',
  backgroundColor = '#ffffff',
  viewBox = `0 0 ${model.size + border * 2} ${model.size + border * 2}`,
  xmlns = 'http://www.w3.org/2000/svg',
  xmlnsXlink = 'http://www.w3.org/1999/xlink',
  xmlSpace = 'preserve',
  ...rest
}: QrcodeProps & Omit<JSX.IntrinsicElements['svg'], 'children' | 'fill'>) {
  const children: React.ReactNode = React.useMemo(
    () => Renderers[renderedAs](model, border, foregroundColor),
    [renderedAs, model, border, foregroundColor]
  );
  return (
    <svg
      {...rest}
      fill={backgroundColor}
      viewBox={viewBox}
      xmlns={xmlns}
      xmlnsXlink={xmlnsXlink}
      xmlSpace={xmlSpace}
    >
      {children}
    </svg>
  );
}
