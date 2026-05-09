import puter from "@heyputer/puter.js"
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";

// Track Puter connection status
let puterConnected = false;
let puterConnectAttempted = false;

// Get PUTER_WORKER_URL directly from constants
const getPuterWorkerUrl = (): string | null => PUTER_WORKER_URL;

// Check if Puter API is reachable
const checkPuterConnection = async (): Promise<boolean> => {
    if (puterConnectAttempted) return puterConnected;
    
    puterConnectAttempted = true;
    try {
        // Test connectivity to Puter API by checking auth status (non-blocking)
        const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Puter connection timeout')), 3000)
        );
        await Promise.race([puter.auth.getUser(), timeout]);
        puterConnected = true;
        console.log('✓ Puter API connected');
        return true;
    } catch (error) {
        puterConnected = false;
        console.warn('⚠ Puter API unavailable - features will be degraded:', error instanceof Error ? error.message : 'Unknown error');
        return false;
    }
};

// Initialize Puter with proper configuration
export const initializePuter = async () => {
    try {
        if (typeof window !== 'undefined') {
            console.log('Puter SDK initialized');
            // Check connection status asynchronously
            await checkPuterConnection();
        }
    } catch (error) {
        console.error('Failed to initialize Puter:', error);
    }
};

export const isPuterAvailable = (): boolean => puterConnected;

export const signIn = async () => {
    try {
        if (!puterConnected) {
            throw new Error('Puter API not available - check your internet connection or verify Puter service status');
        }
        return await puter.auth.signIn();
    } catch (error) {
        console.error('Puter sign in failed:', error);
        throw error;
    }
};

export const signOut = () => {
    try {
        return puter.auth.signOut();
    } catch (error) {
        console.error('Puter sign out failed:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch (error) {
        console.warn('Failed to get current user:', error);
        return null;
    }
}

export const createProject = async ({ item }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    const PUTER_WORKER_URL = getPuterWorkerUrl();
    if (!PUTER_WORKER_URL) {
        console.warn('⚠ Missing VITE_PUTER_WORKER_URL: project save disabled. Configure your Puter worker URL in .env.local')
        return null;
    }

    if (!puterConnected) {
        console.warn('⚠ Puter API not connected: skipping project save. Check internet connection and Puter API status.');
        return null;
    }

    const projectId = item.id;
    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId ?
        await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: "source" }) : null;

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage)
        ? item.sourceImage
        : ""
    );

    if (!resolvedSource) {
        console.warn('Failed to host source image, skipping save.')
        return null;
    }

    const { sourcePath: _s, renderedPath: _r, publicPath: _p, ...rest } = item;
   
    const payload: DesignItem = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: undefined,   // no render yet on create
        timestamp: Date.now()
    }

    try {

        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
            method: 'POST',
            body: JSON.stringify({ project: payload })
        });

        if (!response.ok) {
            console.error('failed to create project', await response.text());
            return null;
        }

        const data = (await response.json()) as { project?: DesignItem | null }
        return data.project ?? null;
    } catch (error) {
        console.error("Failed to create project", error);
        return null;
    }
}

export const listProjects = async (): Promise<DesignItem[]> => {
    return getProjects();
};

export const getProjects = async (): Promise<DesignItem[]> => {
    const PUTER_WORKER_URL = getPuterWorkerUrl();
    if (!PUTER_WORKER_URL) {
        console.warn('⚠ Missing VITE_PUTER_WORKER_URL; skip history fetch; Configure your Puter worker URL in .env.local');
        return []
    }

    if (!puterConnected) {
        console.warn('⚠ Puter API not connected: skipping history fetch. Check internet connection and Puter API status.');
        return []
    }

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, { method: 'GET' });

        if (!response.ok) {
            console.error('Failed to fetch history', await response.text());
            return [];
        }

        const data = (await response.json()) as { projects?: DesignItem[] | null };
        const projects = Array.isArray(data?.projects) ? data?.projects : [];

        // Sort by timestamp descending (newest first)
        return projects.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (e) {
        console.error('Failed to get projects', e);
        return [];
    }
}

export const getProjectById = async ({ id }: { id: string }): Promise<DesignItem | null> => {
    const PUTER_WORKER_URL = getPuterWorkerUrl();
    if (!PUTER_WORKER_URL) {
        console.warn("⚠ Missing VITE_PUTER_WORKER_URL; skipping project fetch. Configure your Puter worker URL in .env.local");
        return null;
    }

    if (!puterConnected) {
        console.warn('⚠ Puter API not connected: skipping project fetch. Check internet connection and Puter API status.');
        return null;
    }

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        if (!response.ok) {
            console.error("Failed to fetch project:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};

export const updateProject = async ({ item }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    const PUTER_WORKER_URL = getPuterWorkerUrl();
    if (!PUTER_WORKER_URL) {
        console.warn('⚠ Missing VITE_PUTER_WORKER_URL: skip project update. Configure your Puter worker URL in .env.local')
        return null;
    }

    if (!puterConnected) {
        console.warn('⚠ Puter API not connected: skipping project update. Check internet connection and Puter API status.');
        return null;
    }

    const projectId = item.id;
    const hosting = await getOrCreateHostingConfig();

    // Only upload rendered image if it's new and not already hosted
    const hostedRender = projectId && item.renderedImage && !isHostedUrl(item.renderedImage) ?
        await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: "rendered" }) : null;

    const resolvedRender = hostedRender?.url ?
        hostedRender?.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
            ? item.renderedImage : undefined;

    const {
        sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload: DesignItem = {
        ...rest,
        renderedImage: resolvedRender,
        timestamp: item.timestamp || Date.now()
    }

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
            method: 'POST',
            body: JSON.stringify({ project: payload })
        });

        if (!response.ok) {
            console.error('failed to update the project', await response.text());
            return null;
        }

        const data = (await response.json()) as { project?: DesignItem | null }
        return data.project ?? null;
    } catch (error) {
        console.error("Failed to update project", error);
        return null;
    }
};