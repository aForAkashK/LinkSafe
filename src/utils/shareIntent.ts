// Share Intent Handler - Handles URLs shared from other apps
import { NativeModules, Platform, Linking } from 'react-native';

export interface SharedItem {
    text?: string;
    weblink?: string;
    mimeType?: string;
}

// Extract URL from shared text
export const extractUrlFromText = (text: string): string | null => {
    if (!text) return null;

    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const matches = text.match(urlRegex);

    if (matches && matches.length > 0) {
        // Return the first URL found
        return matches[0];
    }

    return null;
};

// Check if text is a valid URL
export const isValidUrl = (text: string): boolean => {
    try {
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
        return urlRegex.test(text);
    } catch {
        return false;
    }
};

// Get initial URL from app launch (if launched via share intent)
export const getInitialSharedUrl = async (): Promise<string | null> => {
    try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
            return initialUrl;
        }
    } catch (error) {
        console.log('Error getting initial URL:', error);
    }
    return null;
};
