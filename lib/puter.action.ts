import puter from "@heyputer/puter.js"
import type { CreateProjectParams, DesignItem } from "../type";
import { getOrCreateHosingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";

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
    const projectId = item.id;
    const hosting = await getOrCreateHosingConfig();

    const hostedSource = projectId ?
        await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: "source" }) : null;

    const hostedRender = projectId && item.renderedImage ?
        await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: "rendered" }) : null;

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage)
        ? item.sourceImage
        : ""
    );

    if (!resolvedSource) {
        console.warn('Failed to host source image, skipping save.')
        return null;
    }

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

    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender
    }

   try {

    return payload;
   } catch (error) {
    console.log("Failed to save project", error);
    return null;
   }
}

export const listProjects = async (): Promise<DesignItem[]> => {
    try {
        const projectsDir = "dreamland/projects";
        const entries = await puter.fs.readdir(projectsDir);

        if (!entries || entries.length === 0) {
            return [];
        }

        const projects: DesignItem[] = [];
        for (const entry of entries) {
            if (entry.name.endsWith(".json")) {
                const file = await puter.fs.read(`${projectsDir}/${entry.name}`);
                const project = JSON.parse(file as string) as DesignItem;
                projects.push(project);
            }
        }

        // Sort by timestamp descending (newest first)
        return projects.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        console.warn("Failed to list projects:", error);
        return [];
    }
};