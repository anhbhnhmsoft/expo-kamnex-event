import * as Location from 'expo-location';
import {LocationAccuracy} from 'expo-location';
import {useCallback} from "react";
import {useAppStore} from "@/services/app/stores/useAppStore";


const useLocation = () => {
    const setLocation = useAppStore(s => s.setLocation);

    return useCallback(async () => {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return false;
        }
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: LocationAccuracy.Balanced
            });
            setLocation(location);
            return true;
        }catch {
            return false;
        }
    }, []);
}

export default useLocation;