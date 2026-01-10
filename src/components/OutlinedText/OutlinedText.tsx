import {
  Canvas,
  type Color,
  type DataModule,
  Group,
  PaintStyle,
  Paragraph,
  Skia,
  type SkParagraphStyle,
  type SkTextStyle,
  type SkTypefaceFontProvider,
  TextAlign,
  TextHeightBehavior,
  useFonts,
} from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';

import { AgencyFBBlack, AgencyFBBold } from '@/assets/fonts';

type ThemeFonts = Theme['font']['secondary'];
type FontFamily = ThemeFonts[keyof ThemeFonts];

type OutlinedTextStyle = {
  fontSize: number;
  fontFamily: FontFamily;
  color: Color;
  strokeWidth: number;
};

const fonts: Record<FontFamily, [DataModule]> = {
  'AgencyFB-Bold': [AgencyFBBold as DataModule],
  'AgencyFB-Black': [AgencyFBBlack as DataModule],
};

const getParagraph = (text: string, style: OutlinedTextStyle, fontProvider: SkTypefaceFontProvider) => {
  const outlineForegroundPaint = Skia.Paint();
  outlineForegroundPaint.setStrokeWidth(style.strokeWidth);
  outlineForegroundPaint.setStyle(PaintStyle.Stroke);
  outlineForegroundPaint.setColor(Skia.Color('black'));

  const paragraphStyle: SkParagraphStyle = {
    textAlign: TextAlign.Center,
    textHeightBehavior: TextHeightBehavior.DisableLastDescent,
    maxLines: 1,
  };

  const textStyle: SkTextStyle = {
    fontSize: style.fontSize,
    fontFamilies: [style.fontFamily],
  };

  const paragraphOutline = Skia.ParagraphBuilder.Make(paragraphStyle, fontProvider)
    .pushStyle(textStyle, outlineForegroundPaint)
    .addText(text)
    .pop()
    .build();

  const paragraph = Skia.ParagraphBuilder.Make(paragraphStyle, fontProvider)
    .pushStyle({ ...textStyle, color: Skia.Color(style.color) })
    .addText(text)
    .pop()
    .build();

  paragraphOutline.layout(Number.MAX_SAFE_INTEGER);

  return {
    paragraphOutline,
    paragraph,
    paragraphWidth: paragraphOutline.getLongestLine() + style.strokeWidth,
    paragraphHeight: paragraphOutline.getHeight(),
  } as const;
};

type Props = {
  text: string;
  style: OutlinedTextStyle;
};

export const OutlinedText = ({ text, style }: Readonly<Props>) => {
  const { fontScale } = useWindowDimensions();
  const fontProvider = useFonts(fonts);

  if (!fontProvider) return null;

  const { paragraphOutline, paragraph, paragraphWidth, paragraphHeight } = getParagraph(
    text,
    { ...style, fontSize: style.fontSize * fontScale, strokeWidth: style.strokeWidth * fontScale },
    fontProvider,
  );

  return (
    <Canvas style={{ height: paragraphHeight, width: paragraphWidth }}>
      <Group antiAlias>
        <Paragraph paragraph={paragraphOutline} width={paragraphWidth} x={0} y={0} />
        <Paragraph paragraph={paragraph} width={paragraphWidth} x={0} y={0} />
      </Group>
    </Canvas>
  );
};
