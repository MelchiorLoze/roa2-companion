import {
  Canvas,
  type DataModule,
  Group,
  PaintStyle,
  Paragraph,
  Skia,
  type SkParagraphStyle,
  type SkTextStyle,
  type SkTypefaceFontProvider,
  TextAlign,
  useFonts,
} from '@shopify/react-native-skia';

import { AgencyFBBlack, AgencyFBBold } from '@/assets/fonts';

type ThemeFonts = Theme['font']['secondary'];
type FontFamily = ThemeFonts[keyof ThemeFonts];

const fonts: Record<FontFamily, [DataModule]> = {
  'AgencyFB-Bold': [AgencyFBBold as DataModule],
  'AgencyFB-Black': [AgencyFBBlack as DataModule],
};

const getParagraph = (
  text: string,
  fontFamily: FontFamily,
  color: string,
  strokeWidth: number,
  fontProvider: SkTypefaceFontProvider,
) => {
  const outlineForegroundPaint = Skia.Paint();
  outlineForegroundPaint.setStrokeWidth(strokeWidth);
  outlineForegroundPaint.setStyle(PaintStyle.Stroke);
  outlineForegroundPaint.setColor(Skia.Color('black'));

  const paragraphStyle: SkParagraphStyle = {
    textAlign: TextAlign.Center,
    maxLines: 1,
  };

  const textStyle: SkTextStyle = {
    fontSize: 18,
    fontFamilies: [fontFamily],
  };

  const paragraphOutline = Skia.ParagraphBuilder.Make(paragraphStyle, fontProvider)
    .pushStyle(textStyle, outlineForegroundPaint)
    .addText(text)
    .pop()
    .build();

  const paragraph = Skia.ParagraphBuilder.Make(paragraphStyle, fontProvider)
    .pushStyle({ ...textStyle, color: Skia.Color(color) })
    .addText(text)
    .pop()
    .build();

  paragraphOutline.layout(100);

  return {
    paragraphOutline,
    paragraph,
    paragraphWidth: paragraphOutline.getLongestLine() + strokeWidth,
    paragraphHeight: paragraphOutline.getHeight(),
  } as const;
};

type Props = {
  text: string;
  fontFamily: FontFamily;
  color: string;
  strokeWidth: number;
};

export const OutlinedText = ({ text, fontFamily, color, strokeWidth }: Readonly<Props>) => {
  const fontProvider = useFonts(fonts);

  if (!fontProvider) return null;

  const { paragraphOutline, paragraph, paragraphWidth, paragraphHeight } = getParagraph(
    text,
    fontFamily,
    color,
    strokeWidth,
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
