import {useCallback, useRef, useState} from "react";
import {CameraType, CameraView} from "expo-camera";
import {TouchableOpacity} from "react-native";
import {View, YStack} from "tamagui";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import {router} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";
import {useMutationEditAvatar} from "@/services/auth/hooks/useMutationAuth";
import {useAppStore} from "@/services/app/stores/useAppStore";
import useGetInfoUser from "@/services/auth/hooks/useGetInfoUser";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";


export default function TakePictureScreen(){
    // khai báo camera
    const cameraRef = useRef<CameraView>(null);
    const [facing,setFacing] = useState<CameraType>("back");
    const setLoading = useAppStore(state => state.setLoading);
    const {set} = useGetInfoUser();
    const {mutate} = useMutationEditAvatar();
    const errorHandle = useToastErrorHandler();

    const takePicture = useCallback(async ()=>{
        const camera = cameraRef.current;
        if (!camera || !camera.takePictureAsync) return;
        const photo = await camera.takePictureAsync({
            quality: 0.5,
            base64: false,
            exif: false,
        });
        const form = new FormData();
        form.append('file',{
            uri: photo.uri,
            name: "avatar.jpg",
            type: "image/jpg"
        } as any);
        setLoading(true);
        mutate(form,{
            onSuccess: (res) => {
                setLoading(false);
                set(res.data);
                router.back()
            },
            onError: (err) => {
                setLoading(false);
                errorHandle(err);
                router.back()
            }
        });
    },[])

    return (
        <YStack flex={1}>
            <CameraView
                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                ref={cameraRef}
                facing={facing}
            />
            <View flexDirection={"row"} paddingVertical={50} paddingHorizontal={40} alignItems="center" justifyContent={'space-between'}>
                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture}>
                   <View borderColor={DefaultColor.primary_color} alignItems={"center"} justifyContent={"center"} borderWidth={1} width={50} height={50} borderRadius={50} >
                        <View backgroundColor={DefaultColor.primary_color} borderRadius={40}  width={40} height={40}/>
                   </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (facing === "back"){
                            setFacing("front")
                        }
                        if (facing === "front"){
                            setFacing("back")
                        }
                    }}
                >
                    <AntDesign name="sync" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </YStack>
    )
}

