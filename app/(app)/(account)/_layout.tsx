import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";
import DefaultHeader from "@/components/page/DefaultHeader";

export default function AccountLayout(){

    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.primary_bg },
            }}
        >
            <Stack.Screen name="edit-info" options={{header: () => <DefaultHeader />}}/>
            <Stack.Screen name="take-picture" options={{headerShown: false}} />
        </Stack>
    );

}