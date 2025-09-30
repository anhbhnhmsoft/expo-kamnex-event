import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";
import DefaultHeader from "@/components/page/DefaultHeader";

export default function AccountLayout() {

    return (
        <Stack
            screenOptions={{
                contentStyle: {backgroundColor: DefaultColor.primary_bg},
            }}
        >
            <Stack.Screen name="edit-info" options={{header: () => <DefaultHeader/>}}/>
            <Stack.Screen name="take-picture" options={{headerShown: false}}/>
            <Stack.Screen name="membership/list" options={{
                header: () => <DefaultHeader title={'account.page.membership.list.title'}/>
            }}/>
            <Stack.Screen name="membership/register-list" options={{
                header: () => <DefaultHeader title={'account.page.membership.register_list.title'}/>
            }}/>
            <Stack.Screen name="membership/check-trans" options={{
                headerShown: false,
                gestureEnabled: false,
                contentStyle: {
                    backgroundColor: DefaultColor.white
                }
            }}/>
        </Stack>
    );

}