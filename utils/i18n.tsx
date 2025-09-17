import viJson from '@/langs/vi.json';
import enJson from '@/langs/en.json';
import {Storage} from "@/utils/storages";
import {_StorageKey} from "@/utils/storages/key";
import { getLocales } from 'expo-localization';
import {use} from "i18next";
import { initReactI18next } from "react-i18next";
import {_LanguageCode} from "@/utils/@types";
import {useAppStore} from "@/services/app/stores/useAppStore";

const resources = {
    "vi": { translation: viJson },
    "en": { translation: enJson },
};

const initI18n = async () => {
    const { setLanguage } = useAppStore.getState();
    // Lấy language lưu trong storage
    let savedLanguage = await Storage.getItem<_LanguageCode>(_StorageKey.LANGUAGE);
    // Lấy language từ device nếu chưa lưu
    const deviceLang = getLocales()[0].languageCode as _LanguageCode | null;
    if (!savedLanguage) {
        savedLanguage = deviceLang === _LanguageCode.EN ? _LanguageCode.EN : _LanguageCode.VI;
    }
    // Nếu language không hợp lệ -> default VI
    if (savedLanguage !== _LanguageCode.EN && savedLanguage !== _LanguageCode.VI) {
        savedLanguage = _LanguageCode.VI;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(initReactI18next).init({
        compatibilityJSON: "v4",
        resources,
        lng: savedLanguage,
        fallbackLng: 'vi',
        interpolation: { escapeValue: false },
    });
    // Set vào store
    await setLanguage(savedLanguage);
};

export default initI18n;