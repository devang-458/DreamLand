import React, { useState, useEffect } from "react";
import type { FloorPlanData } from "../lib/floorplan.types";
import FloorPlan3D from "./FloorPlan3D";
import { generateBlenderScript, downloadBlenderScript } from "../lib/blender.generator";

interface FloorPlanExportPanelProps {
  floorPlanData: FloorPlanData | null;
  imageBase64: string | null;
}

const FloorPlanExportPanel: React.FC<FloorPlanExportPanelProps> = ({
  floorPlanData,
  imageBase64,
}) => {
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [isLoadingBlender, setIsLoadingBlender] = useState(false);
  const [blenderError, setBlenderError] = useState<string | null>(null);
  const [threejsError, setThreejsError] = useState<string | null>(null);

  // Auto-clear blender error after 5 seconds
  useEffect(() => {
    if (blenderError) {
      const timer = setTimeout(() => setBlenderError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [blenderError]);

  const handleView3D = () => {
    setThreejsError(null);
    setIs3DModalOpen(true);
  };

  const handleDownloadBlender = async () => {
    if (!floorPlanData) return;

    setIsLoadingBlender(true);
    setBlenderError(null);

    try {
      const script = await generateBlenderScript(floorPlanData);
      downloadBlenderScript(script, "dreamland_floor_plan.py");
    } catch (error) {
      setBlenderError(
        error instanceof Error ? error.message : "Failed to generate script"
      );
    } finally {
      setIsLoadingBlender(false);
    }
  };

  const isDisabled = floorPlanData === null;
  const tooltipText = "Upload and process a floor plan first";

  return (
    <>
      {/* Main Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Export & Visualize
        </h2>

        {/* Buttons */}
        <div className="flex gap-4 mb-4">
          {/* View 3D Button */}
          <div className="relative group flex-1">
            <button
              onClick={handleView3D}
              disabled={isDisabled}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all relative ${
                isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                🏠 View 3D Preview
              </span>
              <span className="absolute top-2 right-2 px-2 py-1 bg-indigo-500 text-white text-xs rounded font-mono">
                AI Powered
              </span>
            </button>
            {isDisabled && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {tooltipText}
              </div>
            )}
          </div>

          {/* Download Blender Button */}
          <div className="relative group flex-1">
            <button
              onClick={handleDownloadBlender}
              disabled={isDisabled || isLoadingBlender}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all border-2 relative ${
                isDisabled
                  ? "border-gray-300 text-gray-500 bg-white cursor-not-allowed"
                  : "border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95"
              } ${isLoadingBlender ? "opacity-75" : ""}`}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoadingBlender ? "⏳ Generating..." : "⬇ Download Blender Script"}
              </span>
              <span className="absolute top-2 right-2 px-2 py-1 bg-indigo-500 text-white text-xs rounded font-mono">
                AI Powered
              </span>
            </button>
            {isDisabled && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {tooltipText}
              </div>
            )}
          </div>
        </div>

        {/* Blender Error Message */}
        {blenderError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{blenderError}</p>
          </div>
        )}
      </div>

      {/* 3D Modal */}
      {is3DModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-85 z-50 flex flex-col"
          onClick={() => setIs3DModalOpen(false)}
        >
          {/* Header */}
          <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-2xl font-bold">3D Floor Plan Preview</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIs3DModalOpen(false);
              }}
              className="text-white hover:bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Canvas Area */}
          <div
            className="flex-1 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {threejsError ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                  <p className="text-red-700 font-semibold mb-2">
                    3D Render Error
                  </p>
                  <p className="text-red-600 text-sm">{threejsError}</p>
                </div>
              </div>
            ) : floorPlanData ? (
              <FloorPlan3D floorPlanData={floorPlanData} />
            ) : null}
          </div>

          {/* Footer Instructions */}
          <div className="bg-gray-900 text-white text-center py-3 text-sm">
            Drag to rotate • Scroll to zoom • Right-click to pan
          </div>
        </div>
      )}
    </>
  );
};

export default FloorPlanExportPanel;
