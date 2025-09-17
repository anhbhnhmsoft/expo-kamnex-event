import {useAppStore} from "@/services/app/stores/useAppStore";
import {useCallback} from "react";
import {_LanguageCode} from "@/utils/@types";
import {changeLanguage} from "i18next";

const useLanguage = () => {
    const language = useAppStore((state) => state.language);
    const setLanguageStore = useAppStore((state) => state.setLanguage);

    const setLanguage = useCallback(async (lang: _LanguageCode) => {
        await changeLanguage(lang);
        await setLanguageStore(lang);
    }, [setLanguageStore]);

    return {language, setLanguage};
};

export default useLanguage;