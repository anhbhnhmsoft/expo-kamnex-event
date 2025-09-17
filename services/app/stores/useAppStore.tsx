import {_LanguageCode} from "@/utils/@types";
import {create} from "zustand";
import {Storage} from "@/utils/storages";
import {_StorageKey} from "@/utils/storages/key";


interface IAppStore {
    language: _LanguageCode;
    setLanguage: (lang: _LanguageCode) => Promise<void>;
    hydrateLanguage: () => Promise<void>;
}

export const useAppStore = create<IAppStore>((set) => ({
    language: _LanguageCode.VI,
    setLanguage: async (lang) => {
        try {
            await Storage.setItem(_StorageKey.LANGUAGE, lang);
            set({ language: lang });
        } catch (err) {
            console.error('Failed to save language', err);
        }
    },
    hydrateLanguage: async () => {
        try {
            let lang = await Storage.getItem<_LanguageCode>(_StorageKey.LANGUAGE);
            if (lang !== _LanguageCode.EN && lang !== _LanguageCode.VI) {
                lang = _LanguageCode.VI;
            }
            set({ language: lang });
        } catch (err) {
            console.error('Failed to load language', err);
        }
    },
}));