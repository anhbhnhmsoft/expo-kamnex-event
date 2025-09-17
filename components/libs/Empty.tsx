import {View} from "tamagui";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useTranslation} from "react-i18next";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import DefaultColor from "@/components/ui/defaultColor";


const Empty = () => {
    const {t} = useTranslation();
    return (
        <View justifyContent={"center"} alignItems={"center"} >
            <FontAwesome6 name="inbox" size={40} color={DefaultColor.slate[300]} />
            <Typo  weight={"700"} fontSize={DefaultSize.md} marginTop={20} color={DefaultColor.slate[500]}>
                {t('common.empty')}
            </Typo>
        </View>
    )
}
export default Empty;