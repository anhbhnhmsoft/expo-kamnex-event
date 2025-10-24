import {router, useLocalSearchParams} from "expo-router";
import {useQueryGetEventSeat, useGetDataEventDetail} from "@/services/event/hooks/use-query-event";
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
import useStoreTransactionEventSeat from "@/services/event/stores/useStoreTransactionEventSeat";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useToast from "@/services/app/hooks/useToast";

export default function SeatsScreen() {
    const {event_id, area_id} = useLocalSearchParams<{ event_id?: string, area_id?: string }>();
    const {event_seat, loading} = useQueryGetEventSeat(event_id, area_id);
    const { loading: eventLoading} = useGetDataEventDetail(event_id || null);
    const setLoading = useAppStore(s => s.setLoading);
    
    useEffect(() => {
        setLoading(loading || eventLoading);
    }, [loading, eventLoading]);
    
    const handleError = useToastErrorHandler();
    const {success} = useToast();
    const {mutate} = useMutateRegisterEventHistory();
    const setEventUserHistory = useEventDetailStore(s => s.setEventUserHistory);
    const setTrans = useStoreTransactionEventSeat(s => s.setTrans);


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
                                            setLoading(false);
                                            
                                            if (res.payment_required && res.data) {
                                                setTrans({...res.data as any, event_id: event_id});
                                                router.replace('/(app)/(event)/booking/check-trans');
                                            } else {
                                                success({message: res.message});
                                                setEventUserHistory(res.data || null);
                                                router.replace({
                                                    pathname: '/(app)/(event)/detail',
                                                    params: {
                                                        id: event_id,
                                                    }
                                                });
                                            }
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