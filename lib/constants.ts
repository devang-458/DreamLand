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
TASK: Convert the input 2D floor plan into an ultra-high-definition, professional, photorealistic **top‑down 3D architectural render**. The output must be completely free of all text, labels, dimensions, and annotations.

STRICT REQUIREMENTS (do not violate):
1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels (e.g., 'WALK-IN CLOSET', 'BEDROOM'), dimensions (e.g., '16'-0"'), or dimension lines (arcs and lines with arrowheads). The flooring (wood grain or tile pattern) must be continuous and seamless where the text used to be. The areas where the corner legend blocks (Sq Ft, Scale, N-arrow) and title 'MODERN APARTMENT UNIT' were are now a seamless continuation of the surrounding background.
2) **GEOMETRY MUST MATCH**: Walls, rooms, door positions, and windows must follow the exact lines, angles, and layout in the plan. The unique L-shape and angled room geometry are preserved precisely.
3) **NEAR-TOP-DOWN ONLY**: An orthographic top‑down view with a slight perspective tilt, as seen in professional real estate visualizations, to show wall thickness, furniture edges, and depth.
4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, highly detailed textures (fabric, wood grain, metal finishes, tile patterns, glass reflection), and photorealistic materials. No sketch/hand‑drawn look.
5) **NO EXTRA CONTENT**: Do not add extra rooms or major features, but ensure all existing details are rendered with high fidelity.

STRUCTURE & DETAILS:
- **Walls**: Solid dark-grey walls with precise thickness, consistent height, and crisp edges.
- **Doors**: Precise door swing arcs converted to realistic open-door models, aligned with the plan.
- **Windows**: Thin perimeter lines and specific glass icons converted into realistic glass panes with slim frames.
- **Flooring**: Continuous and seamless textures (wood grain, tile). The wood floor planks continue without interruption where text used to be.

FURNITURE & ROOM MAPPING (Detailed Descriptions):
- **Balcony (top right)**: Woven rattan furniture (chairs and a table), patterned fabric cushions, a large potted snake plant on the edge, and glass-and-metal railings. All text-free.
- **Living Room (right center)**: A large, modern L-shaped sectional sofa with multiple patterned throw pillows and a draped blanket, a distinct textured area rug, and accent armchairs (one with a footstool).
- **Dining Area (lower center)**: A dark-wood rectangular dining table with six contemporary upholstered dining chairs.
- **Kitchen (bottom right)**: Comprehensive L-shaped cabinetry in dark finishes, detailed appliances (range cooktop, oven, range hood, built-in refrigerator), a large double-basin sink with a coiled high-faucet, and a coffee machine station. All counters and floors continue seamlessly where text used to be.
- **Bedroom (left center)**: A King-size bed with patterned bedding and varied pillows, two nightstands with table lamps (one with books), a long bench at the foot, a detailed desk with a laptop and chair, and a mounted TV.
- **Walk-in Closet (far left)**: Fully detailed shelving holding varied clothes on hangers, shoe boxes, and stacked textiles, all visible and text-free.
- **Bathroom 1 (center-left)**: Detailed with a tub/shower and small toiletries, a vanity with a sink, a mirror, a toilet, and folded towels.
- **Bathroom 2 (lower-left)**: A detailed double-vanity with two sinks, a toilet, and folded towels on a shelf.

STYLE & LIGHTING:
- **Lighting**: Bright, balanced, neutral daylight, supplemented by functional warm recessed spotlights (visible in ceilings) and under-cabinet LED strips (in the kitchen). Realistic soft shadows convey depth.
- **Materials**: Distinguishable textures for wood floors, varied tile patterns (subway tile, geometric mosaic), patterned textiles, metal finishes (brushed stainless, polished chrome), glass, and plant life.
- **Finish**: Professional architectural visualization with high clarity and balanced contrast. No text, no watermarks, no logos, and no title blocks. All text areas are seamlessly continuous floor or background.
`.trim();