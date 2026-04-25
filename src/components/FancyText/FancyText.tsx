import {
  Canvas,
  type DataModule,
  Group,
  PaintStyle,
  Paragraph,
  Skia,
  type SkPaint,
  type SkParagraph,
  type SkParagraphStyle,
  type SkRect,
  type SkTextStyle,
  type SkTypefaceFontProvider,
  TextHeightBehavior,
  TileMode,
  useFonts,
} from '@shopify/react-native-skia';
import { type ColorValue, useWindowDimensions } from 'react-native';

import { FONTS } from '@/assets/fonts';
import { getGradientProps, type Gradient, type GradientColors } from '@/utils/getGradientProps';

const SKIA_FONTS = Object.entries(FONTS).reduce(
  (acc, [key, value]) => {
    acc[key as FontFamily] = [value as DataModule];
    return acc;
  },
  {} as Record<FontFamily, [DataModule]>,
);

type ParagraphResult = {
  paragraphFill: SkParagraph;
  paragraphStroke: SkParagraph;
} & SkRect;

type GradientOrPlainColor<T extends GradientColors> =
  | {
      gradient: Gradient<T> & {
        direction: 'horizontal' | 'vertical';
      };
      color?: never;
    }
  | {
      gradient?: never;
      color: ColorValue;
    };

type FancyTextStyle<T extends GradientColors> = {
  fontSize: number;
  fontFamily: FontFamily;
  strokeWidth: number;
  strokeColor: ColorValue;
} & GradientOrPlainColor<T>;

type Props<T extends GradientColors> = {
  text: string;
  style: FancyTextStyle<T>;
};

const toSkiaColor = (color: ColorValue) => {
  if (typeof color === 'string' || typeof color === 'number') return Skia.Color(color);

  throw new Error('FancyText only supports string and numeric color values');
};

const createParagraph = (
  text: string,
  textStyle: SkTextStyle,
  paint: SkPaint,
  fontProvider: SkTypefaceFontProvider,
): SkParagraph => {
  const paragraphStyle: SkParagraphStyle = {
    textHeightBehavior: TextHeightBehavior.DisableAll,
  };

  const paragraph = Skia.ParagraphBuilder.Make(paragraphStyle, fontProvider)
    .pushStyle(textStyle, paint)
    .addText(text)
    .pop()
    .build();
  paragraph.layout(Number.MAX_SAFE_INTEGER);

  return paragraph;
};

const createParagraphs = <T extends GradientColors>(
  text: string,
  style: FancyTextStyle<T>,
  fontProvider: SkTypefaceFontProvider,
): ParagraphResult => {
  const textStyle: SkTextStyle = {
    fontFamilies: [style.fontFamily],
    fontSize: style.fontSize,
  };

  // STROKE PARAGRAPH
  const strokePaint = Skia.Paint();
  strokePaint.setStyle(PaintStyle.Stroke);
  strokePaint.setStrokeWidth(style.strokeWidth);
  strokePaint.setColor(toSkiaColor(style.strokeColor));

  const paragraphStroke = createParagraph(text, textStyle, strokePaint, fontProvider);

  const textWidth = paragraphStroke.getLongestLine();
  const textHeight = paragraphStroke.getHeight();

  // FILL PARAGRAPH
  const fillPaint = Skia.Paint();

  if (style.gradient) {
    const { start, end, locations } = getGradientProps({
      direction: style.gradient.direction,
      gradient: {
        colors: style.gradient.colors,
        times: style.gradient.times,
      },
    });

    fillPaint.setShader(
      Skia.Shader.MakeLinearGradient(
        { x: start.x * textWidth, y: start.y * textHeight },
        { x: end.x * textWidth, y: end.y * textHeight },
        style.gradient.colors.map(toSkiaColor),
        locations ? [...locations] : null,
        TileMode.Clamp,
      ),
    );
  } else {
    fillPaint.setColor(toSkiaColor(style.color));
  }

  const paragraphFill = createParagraph(text, textStyle, fillPaint, fontProvider);

  const inset = style.strokeWidth;

  return {
    paragraphFill,
    paragraphStroke,
    width: textWidth + inset * 2,
    height: textHeight + inset * 2,
    x: inset,
    y: inset,
  };
};

export const FancyText = <T extends GradientColors>({ text, style }: Readonly<Props<T>>) => {
  const { fontScale } = useWindowDimensions();
  const fontProvider = useFonts(SKIA_FONTS);

  if (!fontProvider) return null;

  const textStyle: FancyTextStyle<T> = {
    ...style,
    fontSize: style.fontSize * fontScale,
    strokeWidth: style.strokeWidth * fontScale,
  };

  const { paragraphFill, paragraphStroke, width, height, x, y } = createParagraphs(text, textStyle, fontProvider);

  return (
    <Canvas style={{ height, width }}>
      <Group antiAlias>
        <Paragraph paragraph={paragraphStroke} width={width} x={x} y={y} />
        <Paragraph paragraph={paragraphFill} width={width} x={x} y={y} />
      </Group>
    </Canvas>
  );
};
