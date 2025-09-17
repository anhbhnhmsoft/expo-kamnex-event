import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import Typo from "@/components/libs/Typo";
import {useTranslation} from "react-i18next";
import {DefaultSize} from "@/components/ui/defaultStyle";
import {Button} from "tamagui";
import DefaultColor from "@/components/ui/defaultColor";
import useLanguage from "@/services/app/hooks/useLanguage";
import {_LanguageCode} from "@/utils/@types";
import {router} from "expo-router";

export default function OnboardScreen() {
    const {t} = useTranslation();
    const {setLanguage, language} = useLanguage();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logo_container}>
                    <Image
                        source={require('@/assets/images/logo/logo-kamnex.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Typo weight="700" style={styles.logo_desc}>
                        {t('auth.page.index.logo_desc')}
                    </Typo>
                </View>
                <View style={styles.btn_container}>
                    <Button width={"100%"} borderRadius={DefaultSize["4xl"]} theme={"blue"} backgroundColor={"transparent"} bordered borderColor={DefaultColor.primary_color}
                            onPress={() => router.replace("/(auth)/register")}
                    >
                        <Typo textTransform={"uppercase"} color={DefaultColor.primary_color} weight={"700"}>
                            {t('common.register')}
                        </Typo>
                    </Button>
                    <Button width={"100%"} borderRadius={DefaultSize["4xl"]} theme={"blue"} backgroundColor={DefaultColor.primary_color}
                            onPress={() => router.replace("/(auth)/login")}
                    >
                        <Typo textTransform={"uppercase"} color={DefaultColor.white} weight={"700"}>
                            {t('common.login')}
                        </Typo>
                    </Button>
                </View>
                <View style={styles.lang_container}>
                    <TouchableOpacity
                        onPress={async () => {
                           await setLanguage(_LanguageCode.VI);
                        }}
                        disabled={language === _LanguageCode.VI}
                    >
                        <Image
                            source={require('@/assets/images/logo/vietnam.png')}
                            style={styles.logo_lang_btn}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => {
                            await setLanguage(_LanguageCode.EN);
                        }}
                        disabled={language === _LanguageCode.EN}
                    >
                        <Image
                            source={require('@/assets/images/logo/eng.png')}
                            style={styles.logo_lang_btn}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    content:{
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 277,
        width: '100%'
    },
    logo_container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 49
    },
    logo: {
        height: 85,
        width: 230
    },
    logo_desc: {
        marginTop: DefaultSize.sm,
        textAlign: "center",
        textTransform: "capitalize",
        fontSize: DefaultSize["3xl"]
    },
    btn_container: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: 10,
        marginBottom: 23
    },
    btn_text:{
        fontSize: DefaultSize["base"],
        color: DefaultColor.white,
        textAlign: "center",
        textTransform:"uppercase",
    },
    lang_container:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        gap: 10
    },
    logo_lang_btn:{
        width: 50,
        height: 33,
        borderRadius: 5
    },
})

