import {
  Canvas,
  Group,
  PaintStyle,
  Paragraph,
  Skia,
  SkParagraphStyle,
  SkTextStyle,
  SkTypefaceFontProvider,
  TextAlign,
  useFonts,
} from '@shopify/react-native-skia';

const getParagraph = (text: string, color: string, strokeWidth: number, fontManager: SkTypefaceFontProvider) => {
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
    fontFamilies: ['AgencyFB-Bold'],
  };

  const paragraphOutline = Skia.ParagraphBuilder.Make(paragraphStyle, fontManager)
    .pushStyle(textStyle, outlineForegroundPaint)
    .addText(text)
    .pop()
    .build();

  const paragraph = Skia.ParagraphBuilder.Make(paragraphStyle, fontManager)
    .pushStyle({ ...textStyle, color: Skia.Color(color) })
    .addText(text)
    .pop()
    .build();

  paragraphOutline.layout(70);

  return {
    paragraphOutline,
    paragraph,
    paragraphWidth: paragraphOutline.getLongestLine() + strokeWidth,
    paragraphHeight: paragraphOutline.getHeight(),
  };
};

type Props = {
  text: string;
  color: string;
  strokeWidth: number;
};

export const OutlinedText = ({ text, color, strokeWidth }: Props) => {
  const fontMngr = useFonts({
    'AgencyFB-Bold': [require('../../assets/fonts/AgencyFB-Bold.ttf')],
  });

  if (!fontMngr) return null;

  const { paragraphOutline, paragraph, paragraphWidth, paragraphHeight } = getParagraph(
    text,
    color,
    strokeWidth,
    fontMngr,
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
