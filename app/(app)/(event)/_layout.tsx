import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";

export default function EventLayout(){
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: DefaultColor.primary_bg },
            }}
        >
            <Stack.Screen name="search"/>
        </Stack>
    );
}