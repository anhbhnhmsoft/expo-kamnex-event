import {router, useLocalSearchParams} from "expo-router";
import {useQueryGetEventSeat} from "@/services/event/hooks/use-query-event";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useEffect} from "react";
import {Card, XStack} from "tamagui";
import {TouchableOpacity} from "react-native";
import Typo from "@/components/libs/Typo";
import Empty from "@/components/libs/Empty";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import {_EventSeatStatus, _EventUserHistory} from "@/services/event/const";
import DefaultColor from "@/components/ui/defaultColor";
import {useMutateRegisterEventHistory} from "@/services/event/hooks/use-mutate-event";
import useEventDetailStore from "@/services/event/stores/useEventDetailStore";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useToast from "@/services/app/hooks/useToast";

export default function SeatsScreen() {
    const {event_id, area_id} = useLocalSearchParams<{ event_id?: string, area_id?: string }>();
    const {event_seat, loading} = useQueryGetEventSeat(event_id, area_id);
    const setLoading = useAppStore(s => s.setLoading);
    useEffect(() => {
        setLoading(loading);
    }, [loading]);
    const handleError = useToastErrorHandler();
    const {success} = useToast();
    const {mutate} = useMutateRegisterEventHistory();
    const setEventUserHistory = useEventDetailStore(s => s.setEventUserHistory);


    return (
        <LayoutScrollApp paddedTop={false}>
            {event_id && area_id && event_seat && event_seat.length > 0 ? (
                <XStack flexWrap={"wrap"} alignItems={"center"} justifyContent={"space-between"} gap={"$2"}>
                    {event_seat.map((item) => (
                        <TouchableOpacity
                            disabled={item.status === _EventSeatStatus.BOOKED}
                            key={item.id} style={{width: "22%"}}
                            onPress={() => {
                                if (event_id) {
                                    setLoading(true);
                                    mutate({
                                        event_id: event_id,
                                        event_seat_id: item.id,
                                        status: _EventUserHistory.BOOKED
                                    }, {
                                        onSuccess: (res) => {
                                            success({message: res.message});
                                            setEventUserHistory(res.data);
                                            setLoading(false);
                                            router.replace({
                                                pathname: '/(app)/(event)/detail',
                                                params: {
                                                    event_id: event_id,
                                                }
                                            })
                                        },
                                        onError: (err) => {
                                            handleError(err);
                                            setLoading(false);
                                        }
                                    })
                                }

                            }}
                        >
                            <Card padded gap={"$2"}
                                  alignItems={"center"}
                                  backgroundColor={item.status === _EventSeatStatus.BOOKED ? DefaultColor.red[500] : DefaultColor.white}
                                  justifyContent={"center"}
                            >
                                <Typo weight={"700"}
                                      color={item.status === _EventSeatStatus.BOOKED ? DefaultColor.white : DefaultColor.black}
                                >{item.seat_code}</Typo>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </XStack>
            ) : <Empty/>}
        </LayoutScrollApp>
    )
}