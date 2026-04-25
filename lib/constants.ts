const vitePuterWorkerUrl = import.meta.env.VITE_PUTER_WORKER_URL;
if (!vitePuterWorkerUrl || vitePuterWorkerUrl.trim() === "") {
    throw new Error("Missing required env VITE_PUTER_WORKER_URL");
}
export const PUTER_WORKER_URL = vitePuterWorkerUrl;

// Storage Paths
export const STORAGE_PATHS = {
    ROOT: "dreamland",
    SOURCES: "dreamland/sources",
    RENDERS: "dreamland/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;
export const DREAMLAND_RENDER_PROMPT = `
TASK: You are provided with a 2D architectural floor plan image as input.
Transform THIS EXACT floor plan — preserving every wall, room boundary, door,
and window position precisely as shown — into an ultra-high-definition,
professional, photorealistic top-down 3D architectural render.
Do NOT invent new rooms or alter the geometry in any way.
The output layout must strictly follow the provided image.

STRICT REQUIREMENTS (do not violate):
1) REMOVE ALL TEXT: Do not render any letters, numbers, labels, dimensions, or dimension lines. Flooring must be continuous and seamless where text used to be.
2) GEOMETRY MUST MATCH: Walls, rooms, door positions, and windows must follow the exact lines, angles, and layout in the provided floor plan image.
3) NEAR-TOP-DOWN ONLY: Orthographic top-down view with a slight perspective tilt, as seen in professional real estate visualizations.
4) CLEAN, REALISTIC OUTPUT: Crisp edges, highly detailed textures (fabric, wood grain, metal finishes, tile patterns, glass reflection). No sketch or hand-drawn look.
5) NO EXTRA CONTENT: Do not add extra rooms or major features not present in the input image.

STRUCTURE & DETAILS:
- Walls: Solid dark-grey walls with precise thickness, consistent height, and crisp edges.
- Doors: Door swing arcs converted to realistic open-door models, aligned with the plan.
- Windows: Thin perimeter lines converted into realistic glass panes with slim frames.
- Flooring: Continuous seamless textures (wood grain, tile) with no interruptions where text used to be.

STYLE & LIGHTING:
- Lighting: Bright, balanced, neutral daylight with warm recessed spotlights and under-cabinet LED strips in the kitchen.
- Materials: Wood floors, tile patterns (subway tile, geometric mosaic), patterned textiles, brushed stainless, polished chrome, glass, and plant life.
- Finish: Professional architectural visualization, high clarity, balanced contrast. No text, watermarks, logos, or title blocks.
`.trim();