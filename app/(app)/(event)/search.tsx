import {Button, XGroup, XStack, YStack} from "tamagui";
import LayoutView from "@/components/libs/LayoutView";
import {TouchableOpacity} from "react-native";
import DefaultColor from "@/components/ui/defaultColor";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DefaultSize, DefaultStyle} from "@/components/ui/defaultStyle";
import {router} from "expo-router";
import useGetProvinces from "@/services/app/hooks/useGetProvinces";
import useSearchEventStore from "@/services/event/stores/useSearchEventStore";
import {useEffect} from "react";
import SelectFields from "@/components/libs/SelectFields";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useTranslation} from "react-i18next";
import Typo from "@/components/libs/Typo";
import FadeView from "@/components/libs/FadeView";
import {_ActionSearchEvent} from "@/services/event/const";
import Feather from '@expo/vector-icons/Feather';


export default function SearchScreen() {
    const {request, setFilter, setAction, setLabelSearch, resetFilter} = useSearchEventStore();
    const {t} = useTranslation();
    const {setLoading} = useAppStore();

    const {
        provinces,
        districts,
        wards,
        loadingDistrict,
        loadingProvince,
        loadingWard,
        setDistrictCode,
        setWardCode
    } = useGetProvinces();

    useEffect(() => {
        setLoading(loadingDistrict || loadingProvince || loadingWard);
    }, [loadingDistrict, loadingProvince, loadingWard]);

    useEffect(() => {
        if (request?.filters?.province_code){
            setDistrictCode(request.filters.province_code);
        }
        if (request?.filters?.district_code){
            setWardCode(request.filters.district_code);
        }
    }, [request?.filters]);

    return (
        <LayoutView>
            {/*Back navigation*/}
            <XStack marginBottom={16} alignItems={"center"} gap={"$4"}>
                <TouchableOpacity style={DefaultStyle.back_btn} onPress={() => {
                    router.replace('/(app)/(tab)');
                    setFilter({
                        province_code: '',
                        district_code: '',
                        ward_code: ''
                    });
                    setLabelSearch({province: '', district: '', ward: ''});
                }}>
                    <FontAwesome name="chevron-left" size={12} color={DefaultColor.primary_color}/>
                </TouchableOpacity>
                <Typo weight={"700"} color={DefaultColor.primary_color}
                      fontSize={DefaultSize.lg}>{t('common.search')}</Typo>
            </XStack>
            <YStack gap={"$4"} justifyContent={"space-between"} flex={1} marginBottom={20}>
                <YStack gap={"$4"}>
                    <YStack gap={"$3"}>
                        <Typo weight={"700"} color={DefaultColor.primary_color}>{t('common.province')}</Typo>
                        <SelectFields
                            placeholder={t('common.select')}
                            options={provinces}
                            value={request?.filters?.province_code ?? ''}
                            onValueChange={(value) => {
                                setFilter({
                                    province_code: value as string,
                                    district_code: '',
                                    ward_code: ''
                                });
                                const label = provinces.find(item => item.value === value)?.label || '';
                                setLabelSearch({province: label, district: '', ward: ''});
                            }}/>
                    </YStack>
                    <FadeView duration={200} visible={Boolean(request?.filters?.province_code && districts.length > 0)} gap={"$3"}>
                        <Typo weight={"700"} color={DefaultColor.primary_color}>{t('common.district')}</Typo>
                        <SelectFields
                            placeholder={t('common.select')}
                            options={districts}
                            value={request?.filters?.district_code ?? ''}
                            onValueChange={(value) => {
                                setFilter({
                                    district_code: value as string,
                                    ward_code: ''
                                });
                                const label = districts.find(item => item.value === value)?.label || '';
                                setLabelSearch({district: label, ward: ''});
                            }}/>
                    </FadeView>
                    <FadeView duration={200} visible={Boolean(request?.filters?.district_code && wards.length > 0)} gap={"$3"}>
                        <Typo weight={"700"} color={DefaultColor.primary_color}>{t('common.ward')}</Typo>
                        <SelectFields
                            placeholder={t('common.select')}
                            options={wards}
                            value={request?.filters?.ward_code ?? ''}
                            onValueChange={(value) => {
                                setFilter({
                                    ward_code: value as string,
                                });
                                const label = wards.find(item => item.value === value)?.label || '';
                                setLabelSearch({ward: label});
                            }}/>
                    </FadeView>
                </YStack>
                <XStack gap={"$2"}>
                    <Button flex={1} borderRadius={DefaultSize["4xl"]} theme={"blue"}
                            backgroundColor={DefaultColor.primary_color}
                            onPress={() => {
                                setAction(_ActionSearchEvent.SEARCH);
                                router.replace('/(app)/(tab)');
                            }}
                    >
                        <Typo textTransform={"uppercase"} color={DefaultColor.white} weight={"700"}>
                            {t('common.search')}
                        </Typo>
                    </Button>
                    <Button borderRadius={30} theme={"blue"}
                            backgroundColor={DefaultColor.white}
                            onPress={() => {
                                resetFilter();
                                setAction(_ActionSearchEvent.SEARCH);
                                router.replace('/(app)/(tab)');
                            }}
                            icon={<Feather name="refresh-ccw" size={24} color={DefaultColor.primary_color} />}
                    >
                    </Button>
                </XStack>
            </YStack>
        </LayoutView>
    )
}