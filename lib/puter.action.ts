import puter from "@heyputer/puter.js"
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";

// Get PUTER_WORKER_URL lazily to avoid module evaluation errors if env var is missing
const getPuterWorkerUrl = (): string | null => {
    try {
        const { PUTER_WORKER_URL } = require('./constants');
        return PUTER_WORKER_URL || null;
    } catch {
        return null;
    }
};

// Initialize Puter with proper configuration
export const initializePuter = async () => {
    try {
        // The Puter.js SDK should auto-initialize, but ensure it's ready
        if (typeof window !== 'undefined') {
            // Puter is initialized globally via the SDK
            console.log('Puter SDK initialized');
        }
    } catch (error) {
        console.error('Failed to initialize Puter:', error);
    }
};

export const signIn = async () => {
    try {
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
        console.warn('Missing VITE_PUTER_WORKER_URL: skip project save')
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
        console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
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
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
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
        console.warn('Missing VITE_PUTER_WORKER_URL: skip project update')
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