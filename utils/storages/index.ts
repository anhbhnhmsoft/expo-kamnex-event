import * as SecureStore from 'expo-secure-store';
import {_StorageKey} from "@/utils/storages/key";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SecureStorage = {
    async getItem<T>(key: _StorageKey): Promise<T | null> {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value ? (JSON.parse(value) as T) : null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return null;
        }
    },
    async setItem<T>(key: _StorageKey, value: T): Promise<boolean> {
        try {
            const jsonValue = JSON.stringify(value);
            await SecureStore.setItemAsync(key, jsonValue);
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return false;
        }
    },
    async removeItem(key: _StorageKey): Promise<boolean> {
        try {
            await SecureStore.deleteItemAsync(key);
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return false;
        }
    },
};

export const Storage = {
    async getItem<T>(key: _StorageKey): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? (JSON.parse(value) as T) : null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return null;
        }
    },
    async setItem<T>(key: _StorageKey, value: T): Promise<boolean> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return false;
        }
    },
    async  removeItem(key: _StorageKey): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(key);
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return false;
        }
    }
}