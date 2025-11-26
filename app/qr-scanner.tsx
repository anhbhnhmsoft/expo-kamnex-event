import {CameraView, BarcodeScanningResult} from "expo-camera";
import {View} from "tamagui";
import DefaultColor from "@/components/ui/defaultColor";
import {useCallback, useRef, useState} from "react";
import {Dimensions} from "react-native";
import {BackendURL} from "@/utils/@types";
import * as WebBrowser from 'expo-web-browser';

export default function QrScannerScreen() {
    const {width, height} = Dimensions.get("window");
    const frameSize = 250;
    const frameLeft = (width - frameSize) / 2;
    const frameTop = (height - frameSize) / 2;
    const [detected, setDetected] = useState(false);
    const isProcessing = useRef(false);

    const handleScan = useCallback(async (scanningResult: BarcodeScanningResult) => {
        if (!scanningResult?.bounds || isProcessing.current) return;
        const validPaths = [
            '/event/quick-register',
            '/event/quick-checkin'
        ];
        const isValidUrl = validPaths.some(path =>
            scanningResult.data?.startsWith(`${BackendURL}${path}`)
        );
        // Kiểm tra pattern URL đúng
        if (isValidUrl) {
            isProcessing.current = true;
            setDetected(true);
            await WebBrowser.openBrowserAsync(scanningResult.data, {
                toolbarColor: DefaultColor.primary_color,
                controlsColor: DefaultColor.primary_bg,
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
                enableBarCollapsing: true,
                readerMode: false,
            });
            // reset sau 2s để quét lại
            setTimeout(() => {
                isProcessing.current = false;
                setDetected(false);
            }, 1000);
        }
    }, []);
    return (
        <View flex={1} position={"relative"}>
            <CameraView
                style={{flex: 1}}
                facing={"back"}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128"]
                }}
                onBarcodeScanned={handleScan}
            >
            </CameraView>
            <View
                position={"absolute"}
                top={frameTop}
                left={frameLeft}
                width={frameSize} height={frameSize} borderWidth={2}
                borderColor={detected ? DefaultColor.green["500"] : DefaultColor.white}
                borderRadius={10}
            />
        </View>
    )
}