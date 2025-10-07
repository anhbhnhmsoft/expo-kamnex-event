import useAuthStore from "@/services/auth/stores/useAuthStore";
import {Paths, File, Directory} from "expo-file-system";
import * as Sharing from 'expo-sharing';
import {useCallback} from "react";
import useToast from "@/services/app/hooks/useToast";
import {useTranslation} from "react-i18next";
import * as IntentLauncher from 'expo-intent-launcher';
import {Platform} from "react-native";


const useDownloadPrivateFile = () => {
    const token = useAuthStore(s => s.token);
    const {t} = useTranslation();
    const {error,warning} = useToast();

    return useCallback(async (fileUrl: string, fileName: string) => {
        if (!token) {
            error({message: t('common_error.authorization_header_not_found')});
            return;
        }
        const destDir = new Directory(Paths.cache, 'download_private_file');

        try {
            if (!destDir.exists) {
                destDir.create();
            }
            const fileNameDateTime = `${Date.now()}_${Math.floor(Math.random() * 10000)}_${fileName}`;
            const destFile = new File(destDir, fileNameDateTime);
            const downloadedFile = await File.downloadFileAsync(fileUrl, destFile, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const uri = downloadedFile.uri;
            if (!uri) {
                throw new Error("No URI returned from download");
            }
            if (Platform.OS === 'android') {
                // Trên Android, dùng Intent để mở file
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: uri,
                    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                });
            } else if (Platform.OS === 'ios') {
                const available = await Sharing.isAvailableAsync();
                if (available) {
                    // iOS: dùng share sheet / open bằng app tương ứng
                    await Sharing.shareAsync(uri);
                }
            }
        } catch (e) {
            error({
                message: t('common_error.download_failed'),
            });
        }
    }, [token, t])
}
export default useDownloadPrivateFile;