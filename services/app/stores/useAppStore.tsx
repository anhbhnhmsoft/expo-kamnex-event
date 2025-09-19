import {_LanguageCode} from "@/utils/@types";
import {create} from "zustand";
import {Storage} from "@/utils/storages";
import {_StorageKey} from "@/utils/storages/key";
import {LocationObject} from "expo-location";


interface IAppStore {
    language: _LanguageCode;
    loading: boolean;
    location: LocationObject | null;
    // functions
    setLanguage: (lang: _LanguageCode) => Promise<void>;
    hydrateLanguage: () => Promise<void>;
    setLoading: (state: boolean) => void;
    setLocation: (location: LocationObject) => void;
}

export const useAppStore = create<IAppStore>((set) => ({
    language: _LanguageCode.VI,
    loading: false,
    location: null,
    // functions
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
    setLoading: (state: boolean) => {
        set({loading: state});
    },
    setLocation: (location: LocationObject) => {
        set({location});
    }
}));