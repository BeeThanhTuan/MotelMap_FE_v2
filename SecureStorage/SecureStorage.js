import * as SecureStore from 'expo-secure-store';

export const setToken = async (token) => {
    try {
        await SecureStore.setItemAsync('secure_token', token);
        console.log('Token saved successfully');
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('secure_token');
        if (token) {
            return token;
        } else {
            console.log('Token not found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

export const deleteToken = async () => {
    try {
        await SecureStore.deleteItemAsync('secure_token');
        console.log('Token deleted successfully');
    } catch (error) {
        console.error('Error deleting token:', error);
    }
};

