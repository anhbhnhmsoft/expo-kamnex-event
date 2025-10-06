import {Notification} from 'expo-notifications';
import {create} from "zustand/index";

interface INotiStore {
    notification: Notification[];
    unread_count: number;
    setUnreadCount: (count: number) => void;
    pushNotification: (notification: Notification) => void;
    removeNotification: (notification: Notification) => void;
    clearNotification: () => void;
}

const useNotiStore = create<INotiStore>((set, get) => ({
    notification: [],
    unread_count: 0,
    setUnreadCount: (count: number) => set({unread_count: count}),
    pushNotification: (data) => {
        set((state) => ({
            notification: [...state.notification, data]
        }));
    },
    removeNotification: (data) => {
        set((state) => ({
            notification: state.notification.filter(
                (item) => item.request.identifier !== data.request.identifier
            )
        }));
    },
    clearNotification: () => {
        set({notification: []});
    }
}));

export default useNotiStore;

