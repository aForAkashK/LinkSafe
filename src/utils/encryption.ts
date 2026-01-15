// Encryption utilities for LinkSafe
import CryptoJS from 'crypto-js';

// Generate a consistent encryption key from app identifier
const getEncryptionKey = (): string => {
    // In production, this could be derived from device-specific info
    return 'LinkSafe_Secure_Key_2024_v1';
};

/**
 * Encrypt data using AES-256
 */
export const encryptData = (data: string): string => {
    try {
        const key = getEncryptionKey();
        return CryptoJS.AES.encrypt(data, key).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

/**
 * Decrypt data using AES-256
 */
export const decryptData = (encryptedData: string): string => {
    try {
        const key = getEncryptionKey();
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};

/**
 * Hash a password using SHA256
 */
export const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString();
};

/**
 * Verify a password against a hash
 */
export const verifyPassword = (password: string, hash: string): boolean => {
    return hashPassword(password) === hash;
};

/**
 * Encrypt an object (converts to JSON, then encrypts)
 */
export const encryptObject = <T>(obj: T): string => {
    const jsonString = JSON.stringify(obj);
    return encryptData(jsonString);
};

/**
 * Decrypt to an object (decrypts, then parses JSON)
 */
export const decryptObject = <T>(encryptedData: string): T => {
    const jsonString = decryptData(encryptedData);
    return JSON.parse(jsonString) as T;
};
