import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FloorPlanData, Room } from "./floorplan.types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn("VITE_GEMINI_API_KEY not set. Floor plan analysis will fail.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

const ANALYZE_PROMPT = `You are an expert architectural analyst. Analyze this 2D floor plan image and extract all spatial data.
Return ONLY a valid JSON object. No explanation, no markdown, no code blocks. No backticks.

Return exactly this shape:
{
  "floorPlan": {
    "totalArea": <number in sq ft>,
    "width": <estimated total width in feet>,
    "height": <estimated total depth in feet>,
    "unit": "feet"
  },
  "rooms": [
    {
      "id": "room_1",
      "name": "<human readable room name>",
      "type": "<living_room|bedroom|kitchen|bathroom|hallway|balcony|dining|office|other>",
      "x": <x position from top-left in feet>,
      "y": <y position from top-left in feet>,
      "width": <width in feet>,
      "height": <depth in feet>,
      "doors": [{ "wall": "<north|south|east|west>", "position": <offset in feet from corner> }],
      "windows": [{ "wall": "<north|south|east|west>", "position": <offset in feet from corner>, "width": <width in feet> }]
    }
  ],
  "walls": { "thickness": <number, typically 0.5 to 1> },
  "scale": "<scale text if visible on image, otherwise null>"
}

Rules:
- If no scale shown, estimate dimensions proportionally from image
- Every room MUST have x, y, width, height as numbers
- x and y are from top-left corner of floor plan
- Return raw JSON only`;

const VALIDATE_PROMPT = `You are a data validator for architectural floor plan JSON.
Fix this JSON:

{JSON_PLACEHOLDER}

Rules:
1. All x, y, width, height must be numbers, no nulls
2. No two rooms should overlap
3. Room names must be human readable
4. All door/window wall values must be exactly: north, south, east, or west
5. Return ONLY the corrected raw JSON. No explanation. No markdown. No backticks.`;

export async function analyzeFloorPlan(
  imageBase64: string
): Promise<FloorPlanData> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY environment variable not set");
    }

    // Extract MIME type and clean base64
    let base64Data = imageBase64;
    let mimeType = "image/jpeg";

    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      mimeType = parts[0].replace("data:", "");
      base64Data = parts[1];
    }

    // Call Gemini with vision capability
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const mimeTypeMap: Record<string, any> = {
      "image/jpeg": "image/jpeg",
      "image/png": "image/png",
      "image/webp": "image/webp",
      "image/gif": "image/gif",
    };

    const response = await model.generateContent([
      ANALYZE_PROMPT,
      {
        inlineData: {
          mimeType: mimeTypeMap[mimeType] || "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    // Extract response text
    const responseText = response.response.text();

    // Strip markdown/backticks
    let cleanedJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON
    const parsed: FloorPlanData = JSON.parse(cleanedJson);

    return parsed;
  } catch (error) {
    throw new Error(
      `Failed to analyze floor plan: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function validateFloorPlan(
  data: FloorPlanData
): Promise<FloorPlanData> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY environment variable not set");
    }

    const jsonString = JSON.stringify(data);
    const validationPrompt = VALIDATE_PROMPT.replace(
      "{JSON_PLACEHOLDER}",
      jsonString
    );

    // Call Gemini for validation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(validationPrompt);

    // Extract response text
    const responseText = response.response.text();

    // Strip markdown/backticks
    let cleanedJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse validated JSON
    const validated: FloorPlanData = JSON.parse(cleanedJson);

    return validated;
  } catch (error) {
    throw new Error(
      `Failed to validate floor plan: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
