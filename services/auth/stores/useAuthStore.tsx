import {_AuthStatus} from "@/services/auth/const";
import {LoginResponse, User} from "@/services/auth/types";
import {create} from 'zustand';
import {SecureStorage, Storage} from "@/utils/storages";
import {_StorageKey} from "@/utils/storages/key";

export interface IAuthStore {
    status: _AuthStatus;
    token: string | null;
    user: User | null;
    login: (response: LoginResponse) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
    setUser: (user: User) => Promise<void>;
}

const useAuthStore = create<IAuthStore>((set, get) => ({
    status: _AuthStatus.UNAUTHORIZED,
    token: null,
    user: null,
    login: async (response) => {
        await SecureStorage.setItem(_StorageKey.SECURE_AUTH_TOKEN, response.token);
        await Storage.setItem(_StorageKey.USER_LOGIN, response.user);
        set({user: response.user, token: response.token, status: _AuthStatus.AUTHORIZED});
    },
    logout: async () => {
        await SecureStorage.removeItem(_StorageKey.SECURE_AUTH_TOKEN);
        await Storage.removeItem(_StorageKey.USER_LOGIN);
        set({user: null, token: null, status: _AuthStatus.UNAUTHORIZED});
    },
   hydrate: async () => {
        const token = await SecureStorage.getItem<string>(_StorageKey.SECURE_AUTH_TOKEN);
        const user = await Storage.getItem<User>(_StorageKey.USER_LOGIN);
        if (user && token) {
            set({user: user, token, status: _AuthStatus.AUTHORIZED});
        }else{
            set({user: null, token: null, status: _AuthStatus.UNAUTHORIZED});
        }
   },
    setUser: async (user: User | null) => {
        await Storage.setItem(_StorageKey.USER_LOGIN, user);
        set({user});
    }
}));

export default useAuthStore;
