// NotificationService.js
import { showMessage } from 'react-native-flash-message';

export const showMessageError = (text) => {
    showMessage({
        message: "Thông báo!",
        description: text,
        type: 'danger',
        color: "black",
        duration: 3000,
        zIndex: 99,
        floating: true,
        position: "top",
        top: 100,
        style: {
            height: 80,
        },
    });
};

export const showMessageSuccess = (text) => {
    showMessage({
        message: "Thông báo!",
        description: text,
        type: 'success',
        color: "black",
        duration: 3000,
        zIndex: 99,
        floating: true,
        position: "top",
        top: 100,
        style: {
            height: 80,
        },
    });
};
