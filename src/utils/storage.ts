// Storage utilities for LinkSafe - Encrypted local storage operations
import EncryptedStorage from 'react-native-encrypted-storage';
import { STORAGE_KEYS } from './constants';
import { encryptObject, decryptObject } from './encryption';

// Types
export interface Folder {
    id: string;
    name: string;
    isPrivate: boolean;
    passwordHash: string | null;
    color: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
}

export interface Link {
    id: string;
    title: string;
    url: string;
    description: string;
    folderId: string | null; // null means root level
    isPrivate: boolean;
    passwordHash: string | null;
    favicon: string | null;
    previewImage: string | null; // OG image from the webpage
    createdAt: string;
    updatedAt: string;
}

export interface AppSettings {
    theme: 'dark' | 'light';
    sortBy: 'updatedAt' | 'createdAt' | 'name';
    sortOrder: 'asc' | 'desc';
}

// Folder Operations
export const getFolders = async (): Promise<Folder[]> => {
    try {
        const encryptedData = await EncryptedStorage.getItem(STORAGE_KEYS.FOLDERS);
        if (!encryptedData) {
            return [];
        }
        return decryptObject<Folder[]>(encryptedData);
    } catch (error) {
        console.error('Error getting folders:', error);
        return [];
    }
};

export const saveFolders = async (folders: Folder[]): Promise<void> => {
    try {
        const encryptedData = encryptObject(folders);
        await EncryptedStorage.setItem(STORAGE_KEYS.FOLDERS, encryptedData);
    } catch (error) {
        console.error('Error saving folders:', error);
        throw error;
    }
};

export const addFolder = async (folder: Folder): Promise<void> => {
    const folders = await getFolders();
    folders.push(folder);
    await saveFolders(folders);
};

export const updateFolder = async (updatedFolder: Folder): Promise<void> => {
    const folders = await getFolders();
    const index = folders.findIndex(f => f.id === updatedFolder.id);
    if (index !== -1) {
        folders[index] = { ...updatedFolder, updatedAt: new Date().toISOString() };
        await saveFolders(folders);
    }
};

export const deleteFolder = async (folderId: string): Promise<void> => {
    const folders = await getFolders();
    const filteredFolders = folders.filter(f => f.id !== folderId);
    await saveFolders(filteredFolders);

    // Also delete all links in this folder
    const links = await getLinks();
    const filteredLinks = links.filter(l => l.folderId !== folderId);
    await saveLinks(filteredLinks);
};

// Link Operations
export const getLinks = async (): Promise<Link[]> => {
    try {
        const encryptedData = await EncryptedStorage.getItem(STORAGE_KEYS.LINKS);
        if (!encryptedData) {
            return [];
        }
        return decryptObject<Link[]>(encryptedData);
    } catch (error) {
        console.error('Error getting links:', error);
        return [];
    }
};

export const saveLinks = async (links: Link[]): Promise<void> => {
    try {
        const encryptedData = encryptObject(links);
        await EncryptedStorage.setItem(STORAGE_KEYS.LINKS, encryptedData);
    } catch (error) {
        console.error('Error saving links:', error);
        throw error;
    }
};

export const addLink = async (link: Link): Promise<void> => {
    const links = await getLinks();
    links.push(link);
    await saveLinks(links);
};

export const updateLink = async (updatedLink: Link): Promise<void> => {
    const links = await getLinks();
    const index = links.findIndex(l => l.id === updatedLink.id);
    if (index !== -1) {
        links[index] = { ...updatedLink, updatedAt: new Date().toISOString() };
        await saveLinks(links);
    }
};

export const deleteLink = async (linkId: string): Promise<void> => {
    const links = await getLinks();
    const filteredLinks = links.filter(l => l.id !== linkId);
    await saveLinks(filteredLinks);
};

export const getLinksByFolder = async (
    folderId: string | null,
): Promise<Link[]> => {
    const links = await getLinks();
    return links.filter(l => l.folderId === folderId);
};

// Settings Operations
export const getSettings = async (): Promise<AppSettings> => {
    try {
        const data = await EncryptedStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!data) {
            return { theme: 'dark', sortBy: 'updatedAt', sortOrder: 'desc' };
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting settings:', error);
        return { theme: 'dark', sortBy: 'updatedAt', sortOrder: 'desc' };
    }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
    try {
        await EncryptedStorage.setItem(
            STORAGE_KEYS.SETTINGS,
            JSON.stringify(settings),
        );
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
    try {
        await EncryptedStorage.clear();
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
};
