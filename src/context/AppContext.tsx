// App Context - Global state management for LinkSafe
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NativeModules, AppState, Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import {
    Folder,
    Link,
    getFolders,
    getLinks,
    saveFolders,
    saveLinks,
    addFolder as addFolderStorage,
    updateFolder as updateFolderStorage,
    deleteFolder as deleteFolderStorage,
    addLink as addLinkStorage,
    updateLink as updateLinkStorage,
    deleteLink as deleteLinkStorage,
} from '../utils/storage';
import { extractUrlFromText } from '../utils/shareIntent';

const { ShareIntentModule } = NativeModules;

interface AppContextType {
    folders: Folder[];
    links: Link[];
    loading: boolean;
    refreshData: () => Promise<void>;
    addFolder: (folder: Folder) => Promise<void>;
    updateFolder: (folder: Folder) => Promise<void>;
    deleteFolder: (folderId: string) => Promise<void>;
    addLink: (link: Link) => Promise<void>;
    updateLink: (link: Link) => Promise<void>;
    deleteLink: (linkId: string) => Promise<void>;
    getLinksByFolder: (folderId: string | null) => Link[];
    unlockedItems: Set<string>;
    unlockItem: (itemId: string) => void;
    lockItem: (itemId: string) => void;
    isItemUnlocked: (itemId: string) => boolean;
    // Shared URL handling (for Android - still opens modal)
    sharedUrl: string | null;
    clearSharedUrl: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());
    const [sharedUrl, setSharedUrl] = useState<string | null>(null);

    const refreshData = async () => {
        setLoading(true);
        try {
            const [foldersData, linksData] = await Promise.all([
                getFolders(),
                getLinks(),
            ]);
            setFolders(foldersData);
            setLinks(linksData);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process pending links from iOS Share Extension (auto-save without asking)
    const processPendingLinks = async () => {
        if (Platform.OS === 'ios' && ShareIntentModule?.getPendingLinks) {
            try {
                const pendingLinks: string[] = await ShareIntentModule.getPendingLinks();

                if (pendingLinks && pendingLinks.length > 0) {
                    console.log('[ShareIntent] Processing', pendingLinks.length, 'pending links');

                    // Get current links to check for duplicates
                    const currentLinks = await getLinks();
                    const existingUrls = new Set(currentLinks.map(l => l.url));

                    const newLinks: Link[] = [];

                    for (const urlString of pendingLinks) {
                        const url = extractUrlFromText(urlString) || urlString;

                        // Skip if URL already exists
                        if (existingUrls.has(url)) {
                            console.log('[ShareIntent] Skipping duplicate:', url);
                            continue;
                        }

                        // Create new link
                        const newLink: Link = {
                            id: uuidv4(),
                            title: url, // Will be updated by link preview later
                            url: url,
                            description: '',
                            folderId: null, // Save to root
                            isPrivate: false,
                            passwordHash: null,
                            favicon: null,
                            previewImage: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };

                        newLinks.push(newLink);
                        existingUrls.add(url);
                    }

                    if (newLinks.length > 0) {
                        // Save all new links
                        const allLinks = [...currentLinks, ...newLinks];
                        await saveLinks(allLinks);

                        // Update state
                        setLinks(allLinks);

                        console.log('[ShareIntent] Saved', newLinks.length, 'new links');
                    }
                }
            } catch (error) {
                console.log('[ShareIntent] Error processing pending links:', error);
            }
        }
    };

    // Check for shared content (Android - opens modal)
    const checkSharedContent = async () => {
        if (Platform.OS === 'android' && ShareIntentModule) {
            try {
                const sharedText = await ShareIntentModule.getSharedText();
                if (sharedText) {
                    console.log('[ShareIntent] Received shared text:', sharedText);
                    const url = extractUrlFromText(sharedText);
                    if (url) {
                        setSharedUrl(url);
                    } else if (sharedText.startsWith('http')) {
                        setSharedUrl(sharedText);
                    }
                }
            } catch (error) {
                console.log('[ShareIntent] Error getting shared text:', error);
            }
        }
    };

    // Handle shared content from other apps
    useEffect(() => {
        // Check on initial mount
        if (Platform.OS === 'ios') {
            processPendingLinks();
        } else {
            checkSharedContent();
        }

        // Also check when app comes to foreground
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                if (Platform.OS === 'ios') {
                    processPendingLinks();
                } else {
                    checkSharedContent();
                }
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        refreshData();
    }, []);

    const addFolder = async (folder: Folder) => {
        await addFolderStorage(folder);
        setFolders(prev => [...prev, folder]);
    };

    const updateFolder = async (folder: Folder) => {
        await updateFolderStorage(folder);
        setFolders(prev => prev.map(f => (f.id === folder.id ? folder : f)));
    };

    const deleteFolder = async (folderId: string) => {
        await deleteFolderStorage(folderId);
        setFolders(prev => prev.filter(f => f.id !== folderId));
        setLinks(prev => prev.filter(l => l.folderId !== folderId));
    };

    const addLink = async (link: Link) => {
        await addLinkStorage(link);
        setLinks(prev => [...prev, link]);
    };

    const updateLink = async (link: Link) => {
        await updateLinkStorage(link);
        setLinks(prev => prev.map(l => (l.id === link.id ? link : l)));
    };

    const deleteLink = async (linkId: string) => {
        await deleteLinkStorage(linkId);
        setLinks(prev => prev.filter(l => l.id !== linkId));
    };

    const getLinksByFolder = (folderId: string | null): Link[] => {
        return links.filter(l => l.folderId === folderId);
    };

    const unlockItem = (itemId: string) => {
        setUnlockedItems(prev => new Set(prev).add(itemId));
    };

    const lockItem = (itemId: string) => {
        setUnlockedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });
    };

    const isItemUnlocked = (itemId: string): boolean => {
        return unlockedItems.has(itemId);
    };

    const clearSharedUrl = () => {
        setSharedUrl(null);
    };

    return (
        <AppContext.Provider
            value={{
                folders,
                links,
                loading,
                refreshData,
                addFolder,
                updateFolder,
                deleteFolder,
                addLink,
                updateLink,
                deleteLink,
                getLinksByFolder,
                unlockedItems,
                unlockItem,
                lockItem,
                isItemUnlocked,
                sharedUrl,
                clearSharedUrl,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
