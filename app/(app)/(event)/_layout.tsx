import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";
import {HeaderDetailScreen} from "@/app/(app)/(event)/detail";
import DefaultHeader from "@/components/page/DefaultHeader";

export default function EventLayout(){
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.primary_bg },
            }}
        >
            <Stack.Screen name="search" options={{ headerShown: false }}/>
            <Stack.Screen name="detail" options={{header: () => <HeaderDetailScreen />}}/>
            <Stack.Screen name="detail-schedule" options={{ header: () => <DefaultHeader/> }}/>
            <Stack.Screen name="detail-document" options={{ header: () => <DefaultHeader/> }}/>

        </Stack>
    );
}