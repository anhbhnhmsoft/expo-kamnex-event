import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";
import {HeaderDetailScreen} from "@/app/(app)/(event)/detail";

export default function EventLayout(){
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.primary_bg },
            }}
        >
            <Stack.Screen name="search" options={{ headerShown: false }}/>
            <Stack.Screen name="detail" options={{header: () => <HeaderDetailScreen />}}/>
        </Stack>
    );
}