import {Tabs} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";
import {FontAwesome5} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";


export default function TabLayout() {
    const {t}  = useTranslation();
    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                animation:"shift",
                headerShown: false,
                tabBarActiveTintColor: DefaultColor.primary_color,
                sceneStyle: {
                    backgroundColor: DefaultColor.primary_bg
                },
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: DefaultColor.white,
                    backgroundColor: DefaultColor.primary_bg
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tab.home'),
                    tabBarIcon: (props) =>
                        <FontAwesome5 name="home" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="seen"
                options={{
                    title: t('tab.seen'),
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="newspaper" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="registered"
                options={{
                    title: t('tab.registered'),
                    tabBarIcon: (props) =>
                        <FontAwesome name="sign-out" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: t('tab.account'),
                    tabBarIcon: (props) =>
                        <FontAwesome name="user" size={props.size} color={props.color} />
                }}
            />
        </Tabs>
    )
}