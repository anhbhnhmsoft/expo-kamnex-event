import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {Card, Input, ScrollView, Separator, Sheet, YStack} from "tamagui";
import useQueryGetOrganizers from "@/services/app/hooks/useQueryGetOrganizers";
import {useTranslation} from "react-i18next";
import useDebounce from "@/services/app/hooks/useDebounce";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import Empty from "@/components/libs/Empty";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {DefaultSize} from "@/components/ui/defaultStyle";
import DefaultColor from "@/components/ui/defaultColor";
import Typo from "@/components/libs/Typo";
import {TouchableOpacity} from "react-native";
import LoadingList from "@/components/libs/LoadingList";

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    value: string | null,
    onChange: (value: { item: string, label: string }) => void
}

const ChooseOrganizer: FC<Props> = ({open, setOpen, value, onChange}) => {
    const {t} = useTranslation();

    const [keyword, setKeyword] = useState<string>('');

    const handleError = useToastErrorHandler();

    const {data, refetch, isRefetching, isLoading, error} = useQueryGetOrganizers({key: keyword}, open);

    useEffect(() => {
        handleError(error);
    }, [error]);

    const filterDebounce = useDebounce((value: string) => {
        setKeyword(value);
        refetch();
    }, 1000, []);

    return (
        <Sheet
            modal={true}
            open={open}
            disableDrag={true}
            onOpenChange={setOpen}
            snapPoints={[90]}
            dismissOnSnapToBottom
            zIndex={999_999}
            animation="medium"
        >
            <Sheet.Overlay
                animation="lazy"
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle/>
            <Sheet.Frame padding="$4" gap="$2">
                <Input
                    size="$4"
                    borderWidth={1}
                    backgroundColor={"transparent"}
                    placeholder={t('component.choose_organizer.placeholder_search')}
                    onChangeText={(text) => filterDebounce(text)}
                />
                <Separator marginVertical={15}/>
                <ScrollView>
                    <YStack gap={"$2"}>
                        {isLoading || isRefetching ? <LoadingList/> : (
                            (data && data.length > 0) ?
                                data.map((item, index) => (
                                    <TouchableOpacity key={`${item.id}-${index}`} onPress={() => {
                                        onChange({item: item.id, label: item.name});
                                        setOpen(false);
                                    }}>
                                        <Card bordered padded backgroundColor={"transparent"} flexDirection={"row"} gap={"$2"} alignItems={"center"}>
                                            {item.id === value ?
                                                <FontAwesome5 name="check-circle" size={DefaultSize.lg}
                                                              color={DefaultColor.green[500]}/> :
                                                <FontAwesome5 name="circle" size={DefaultSize.lg}
                                                              color={DefaultColor.green[500]}/>}
                                            <Typo numberOfLines={1}>{item.name}</Typo>
                                        </Card>
                                    </TouchableOpacity>
                                ))
                                : <Empty/>
                        )}
                    </YStack>
                </ScrollView>
            </Sheet.Frame>
        </Sheet>
    )
}

export default ChooseOrganizer;