import {useQueryDetailDocument} from "@/services/schedules/hooks/use-query-schedule";
import {useLocalSearchParams} from "expo-router";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useEffect} from "react";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import {Card, useWindowDimensions, YStack} from "tamagui";
import LoadingList from "@/components/libs/LoadingList";
import {useTranslation} from "react-i18next";
import DefaultColor from "@/components/ui/defaultColor";
import {DefaultSize} from "@/components/ui/defaultStyle";
import Typo from "@/components/libs/Typo";
import {TouchableOpacity} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Empty from "@/components/libs/Empty";
import RenderHtml from "react-native-render-html";
import useDownloadPrivateFile from "@/services/schedules/hooks/useDownloadPrivateFile";


export default function DetailDocumentScreen() {
    const {t} = useTranslation();
    const {id} = useLocalSearchParams<{ id?: string }>();
    const {width} = useWindowDimensions();
    const {document, loading} = useQueryDetailDocument(id);
    const setLoading = useAppStore(s => s.setLoading);

    const downloadFile = useDownloadPrivateFile();

    useEffect(() => {
        setLoading(loading);
    }, [loading]);

    return (
        <LayoutScrollApp paddedTop={false}>
            {document
                ?
                <>
                    <Typo weight={"700"} color={DefaultColor.primary_color} fontSize={DefaultSize['xl']}
                          marginBottom={16}>{document.title}</Typo>
                    <Card padded backgroundColor={DefaultColor.white} gap={"$2"} marginBottom={16}>
                        <Typo weight={"700"} color={DefaultColor.slate[500]}
                              fontSize={DefaultSize['md']}>{t('common.file_assign')}</Typo>
                        {(document.files && Array.isArray(document.files) && document.files.length > 0) ? document.files.map((file) => (
                            <TouchableOpacity
                                onPress={async () => {
                                    setLoading(true);
                                    try {
                                        await downloadFile(file.file_path, file.file_name);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                key={document.id + Math.random().toString()}
                            >
                                <Card backgroundColor={DefaultColor.slate[100]} padded flexDirection={"row"}
                                      alignItems={"center"} gap={"$2"}>
                                    <FontAwesome name="file-text-o" size={24} color="black"/>
                                    <Typo weight={"700"} fontSize={DefaultSize.base} numberOfLines={2}>{file.file_name}</Typo>
                                </Card>
                            </TouchableOpacity>
                        )) : <Empty/>}
                    </Card>
                    <RenderHtml
                        source={{html: document.description}}
                        contentWidth={width}
                    />
                </>
                :
                <YStack gap={"$2"}>
                    <LoadingList/>
                    <LoadingList/>
                </YStack>}
        </LayoutScrollApp>
    )
}