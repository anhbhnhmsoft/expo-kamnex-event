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
            <Stack.Screen
                name="list-comment"
                options={{
                    header: () => <DefaultHeader title={'event.page.list_comment.title'}/>,
                    animation: "slide_from_right",
                }}
            />
            <Stack.Screen
                name="booking/area"
                options={{
                    header: () => <DefaultHeader title={'event.page.booking_area.title'}/>,
                    animation: "slide_from_right",
                }}
            />
            <Stack.Screen
                name="booking/seats"
                options={{
                    header: () => <DefaultHeader title={'event.page.booking_seats.title'}/>,
                    animation: "slide_from_right",
                }}
            />
            <Stack.Screen
                name="booking/check-trans"
                options={{
                    header: () => <DefaultHeader title={'event.page.booking_check_trans.title'} centerTitle={true}/>,
                }}
            />
            <Stack.Screen
                name="check-document-payment"
                options={{
                    header: () => <DefaultHeader />,
                }}
            />
        </Stack>
    );
}