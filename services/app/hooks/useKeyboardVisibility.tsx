import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardVisibility = () => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        // Lắng nghe sự kiện khi bàn phím xuất hiện
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });

        // Lắng nghe sự kiện khi bàn phím ẩn đi
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        // Cleanup: Hủy các listener khi component bị unmount
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return isKeyboardVisible;
};

export default useKeyboardVisibility;
