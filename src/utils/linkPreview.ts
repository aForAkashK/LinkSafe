// Link Preview utility - Fetches Open Graph metadata from URLs
// Uses LinkPreview API to get OG images like WhatsApp does

export interface LinkPreview {
    title: string | null;
    description: string | null;
    image: string | null;
    favicon: string | null;
    siteName: string | null;
}

/**
 * Fetch Open Graph metadata from a URL
 * Tries multiple APIs for reliability
 */
export const fetchLinkPreview = async (url: string): Promise<LinkPreview> => {
    const timeout = 8000; // 8 second timeout

    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        console.log('[LinkPreview] Fetching preview for:', url);

        // Try Microlink API first
        const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.log('[LinkPreview] API response not OK:', response.status);
            return getEmptyPreview();
        }

        const data = await response.json();
        console.log('[LinkPreview] Got response, image:', data.data);

        if (data.status === 'success' && data.data) {
            return {
                title: data.data.title || null,
                description: data.data.description || null,
                image: data.data.image?.url || null,
                favicon: data.data.logo?.url || null,
                siteName: data.data.publisher || null,
            };
        }

        return getEmptyPreview();
    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.log('[LinkPreview] Request timed out');
        } else {
            console.log('[LinkPreview] Error:', error.message);
        }

        return getEmptyPreview();
    }
};

/**
 * Returns empty preview object
 */
const getEmptyPreview = (): LinkPreview => ({
    title: null,
    description: null,
    image: null,
    favicon: null,
    siteName: null,
});

/**
 * Get fallback image URL using Google favicon service
 */
export const getFallbackFavicon = (url: string): string => {
    try {
        const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\?#]+)/i);
        const domain = match ? match[1] : url;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
        return '';
    }
};

// Re-export for compatibility
export const fetchLinkPreviewCombined = fetchLinkPreview;
