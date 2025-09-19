import {FC} from 'react';
import {Text as TextRN, TextProps, ColorValue, TextStyle, DimensionValue} from 'react-native';
import DefaultColor from "@/components/ui/defaultColor";

type Weight =
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';

interface Props extends TextProps {
    weight?: Weight;
    italic?: boolean;
    color?: ColorValue;
    fontSize?: number;
    padding?: DimensionValue; // Padding chung
    margin?: DimensionValue; // Margin chung
    paddingHorizontal?: DimensionValue;
    paddingVertical?: DimensionValue;
    marginHorizontal?: DimensionValue;
    marginVertical?: DimensionValue;
    // Các props margin/padding riêng theo phía
    paddingTop?: DimensionValue;
    paddingBottom?: DimensionValue;
    paddingLeft?: DimensionValue;
    paddingRight?: DimensionValue;
    marginTop?: DimensionValue;
    marginBottom?: DimensionValue;
    marginLeft?: DimensionValue;
    marginRight?: DimensionValue;
    textTransform?: "none" | "capitalize" | "uppercase" | "lowercase",
    textAlign?: "auto" | "left" | "right" | "center" | "justify" | undefined,
    lineHeight?: number
}

const fontMap: Record<string, string> = {
    '100': 'Inter_100Thin',
    '200': 'Inter_200ExtraLight',
    '300': 'Inter_300Light',
    '400': 'Inter_400Regular',
    '500': 'Inter_500Medium',
    '600': 'Inter_600SemiBold',
    '700': 'Inter_700Bold',
    '800': 'Inter_800ExtraBold',
    '900': 'Inter_900Black',
    '100_italic': 'Inter_100Thin_Italic',
    '200_italic': 'Inter_200ExtraLight_Italic',
    '300_italic': 'Inter_300Light_Italic',
    '400_italic': 'Inter_400Regular_Italic',
    '500_italic': 'Inter_500Medium_Italic',
    '600_italic': 'Inter_600SemiBold_Italic',
    '700_italic': 'Inter_700Bold_Italic',
    '800_italic': 'Inter_800ExtraBold_Italic',
    '900_italic': 'Inter_900Black_Italic',
};

const Typo: FC<Props> = ({
                             style,
                             weight = '400',
                             italic = false,
                             color,
                             fontSize,
                             padding,
                             margin,
                             paddingHorizontal,
                             paddingVertical,
                             paddingTop,
                             paddingBottom,
                             paddingLeft,
                             paddingRight,
                             marginHorizontal,
                             marginVertical,
                             marginTop,
                             marginBottom,
                             marginLeft,
                             marginRight,
                             textTransform,
                             textAlign,
                             lineHeight,
                             ...props
                         }) => {
    const fontKey = italic ? `${weight}_italic` : weight;
    const fontFamily = fontMap[fontKey];
    const colorVal = color || DefaultColor.black;

    // Tạo style cho fontSize, padding, margin và các kiểu khác
    const textStyle: TextStyle = {
        fontFamily,
        color: colorVal,
        fontSize,
        padding,
        margin,
        paddingHorizontal,
        paddingVertical,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        marginHorizontal,
        marginVertical,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        textTransform,
        textAlign,
        lineHeight
    };

    return <TextRN {...props} style={[textStyle, style]}/>;
};

export default Typo;
