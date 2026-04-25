import {
  Canvas,
  type DataModule,
  Group,
  PaintStyle,
  Paragraph,
  Skia,
  type SkPaint,
  type SkParagraph,
  type SkRect,
  type SkTextShadow,
  type SkTextStyle,
  type SkTypefaceFontProvider,
  TileMode,
  type TransformProp,
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
  paragraphRect: SkRect;
};

type GradientOrPlainColor<T extends GradientColors> = Either<
  { gradient: Gradient<T> & { direction: 'horizontal' | 'vertical' } },
  { color: ColorValue }
>;

type FancyTextStyle<T extends GradientColors> = {
  fontSize: number;
  fontFamily: FontFamily;
  strokeWidth?: number;
  strokeColor?: ColorValue;
  shadow?: SkTextShadow;
  skew?: number;
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
  const paragraph = Skia.ParagraphBuilder.Make({}, fontProvider)
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
    shadows: style.shadow ? [style.shadow] : [],
  };

  // STROKE PARAGRAPH
  const strokePaint = Skia.Paint();
  strokePaint.setStyle(PaintStyle.Stroke);
  strokePaint.setStrokeWidth(style.strokeWidth ?? 0);
  strokePaint.setColor(toSkiaColor(style.strokeColor ?? 'transparent'));

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

  const inset = style.strokeWidth ?? 0;

  return {
    paragraphFill,
    paragraphStroke,
    paragraphRect: {
      width: textWidth + inset * 2,
      height: textHeight + inset * 2,
      x: inset,
      y: inset,
    },
  } as const;
};

// Only handles horizontal skew for now, using skewY given Skia axis swap
const computeSkew = (skew: number, initialRect: SkRect): SkRect & TransformProp => {
  const { width: initialWidth, height, x: initialX, y } = initialRect;

  const horizontalOverflow = Math.abs(skew) * height;
  const width = initialWidth + horizontalOverflow;
  const x = initialX + (skew < 0 ? horizontalOverflow : 0);
  const transform = skew ? [{ skewY: skew }] : undefined;

  return { width, height, x, y, transform } as const;
};

export const FancyText = <T extends GradientColors>({ text, style }: Readonly<Props<T>>) => {
  const { fontScale } = useWindowDimensions();
  const fontProvider = useFonts(SKIA_FONTS);

  if (!fontProvider) return null;

  const textStyle: FancyTextStyle<T> = {
    ...style,
    fontSize: style.fontSize * fontScale,
    strokeWidth: (style.strokeWidth ?? 0) * fontScale,
  };

  const { paragraphFill, paragraphStroke, paragraphRect } = createParagraphs(text, textStyle, fontProvider);
  const { width, height, x, y, transform } = computeSkew(style.skew ?? 0, paragraphRect);

  return (
    <Canvas style={{ height, width }}>
      <Group transform={transform}>
        <Paragraph paragraph={paragraphStroke} width={width} x={x} y={y} />
        <Paragraph paragraph={paragraphFill} width={width} x={x} y={y} />
      </Group>
    </Canvas>
  );
};
