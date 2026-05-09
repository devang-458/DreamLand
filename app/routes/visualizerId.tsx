import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router';
import { generate3DView } from '../../lib/ai.action';
import { createProject, getProjectById, updateProject } from '../../lib/puter.action';
import { analyzeFloorPlan, validateFloorPlan } from '../../lib/floorplan.analysis';
import { Box, Download, RefreshCcw, Share2, TruckElectric, X, Check, Copy } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import FloorPlanExportPanel from '../../components/FloorPlanExportPanel';
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';
import { fetchBlobFromUrl, getImageExtension } from '../../lib/utils';
import type { FloorPlanData } from '../../lib/floorplan.types';

const VisualizerId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { initialImage, name, initialRender } = location.state || {};
  const { userId } = useOutletContext<AuthContext>();

  const hasInitialGenerated = useRef(false);
  const [project, setProjects] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectsLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanData | null>(null);
  const [floorPlanError, setFloorPlanError] = useState<string | null>(null);
  
  // Share feature state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleBack = () => navigate('/');

  // Get shareable URL
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/visualizer/${id}`;
  };

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleExport = async () => {
    if (!currentImage) return;

    try {
      const result = await fetchBlobFromUrl(currentImage);
      if (!result) throw new Error('Could not fetch image');

      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dreamland-render-${id || 'project'}.${getImageExtension(result.contentType, currentImage)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const runGeneration = async (item: DesignItem) => {
    if (!id || !item.sourceImage) return;

    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: item.sourceImage });

      if (result.renderImage) {
        setCurrentImage(result.renderImage);

        const updatedItem = {
          ...item,
          renderedImage: result.renderImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: item.ownerId ?? userId ?? null,
          isPublic: item.isPublic ?? false
        }

        // Save to Puter
        const saved = await createProject({ item: updatedItem, visibility: 'private' })

        if (saved) {
          setProjects(saved)
          setCurrentImage(saved.renderedImage || result.renderImage)
          // Save to localStorage as well
          localStorage.setItem(`project_${id}`, JSON.stringify(saved));
        }

        // Update existing project in Puter
        if (id) {
          await updateProject({
            item: {
              id,
              name,
              sourceImage: item.sourceImage,
              renderedImage: result.renderImage,
              timestamp: Date.now()
            },
            visibility: 'private'
          });
        }
        
        setProjects(updatedItem)
        // Save to localStorage
        localStorage.setItem(`project_${id}`, JSON.stringify(updatedItem));

        // Analyze floor plan from source image
        try {
          if (item.sourceImage) {
            const raw = await analyzeFloorPlan(item.sourceImage);
            const validated = await validateFloorPlan(raw);
            setFloorPlanData(validated);
            setFloorPlanError(null);
          }
        } catch (error) {
          setFloorPlanError('Could not analyze floor plan. Please try a clearer image.');
          setFloorPlanData(null);
          console.error('Floor plan analysis failed:', error);
        }
      }
    } catch (error) {
      console.error('Generation failed : ', error)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const loadProject = async () => {
      if (!id) {
        setIsProjectsLoading(false);
        return;
      }

      setIsProjectsLoading(true);
      
      // Try to load from Puter first
      let fetchedProject = await getProjectById({ id });

      // If Puter fails, try localStorage as fallback
      if (!fetchedProject) {
        try {
          const cached = localStorage.getItem(`project_${id}`);
          if (cached) {
            fetchedProject = JSON.parse(cached) as DesignItem;
            console.log('✓ Loaded project from cache');
          }
        } catch (error) {
          console.warn('Failed to load from cache:', error);
        }
      } else {
        // Save to localStorage for persistence
        try {
          localStorage.setItem(`project_${id}`, JSON.stringify(fetchedProject));
        } catch (error) {
          console.warn('Failed to cache project:', error);
        }
      }

      if (!isMounted) return;

      setProjects(fetchedProject || null);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectsLoading(false);
      hasInitialGenerated.current = false;

      // If we have project data and floor plan hasn't been analyzed yet, analyze it
      if (fetchedProject?.sourceImage && !floorPlanData) {
        try {
          const raw = await analyzeFloorPlan(fetchedProject.sourceImage);
          const validated = await validateFloorPlan(raw);
          if (isMounted) {
            setFloorPlanData(validated);
            setFloorPlanError(null);
          }
        } catch (error) {
          if (isMounted) {
            setFloorPlanError('Could not analyze floor plan. Please try a clearer image.');
            console.error('Floor plan analysis failed:', error);
          }
        }
      }
    }

    loadProject();

    return () => { isMounted = false };
  }, [id, floorPlanData])

  useEffect(() => {
    if (isProjectLoading || hasInitialGenerated.current || !project?.sourceImage) return

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true
      return
    }

    hasInitialGenerated.current = true;
    void runGeneration(project)
  }, [project, isProjectLoading])

  return (
    <div className='visualizer'>
      <nav className='topbar'>
        <div className='brand'>
          <Box className='logo' />
          <span className='name'>DreamLand</span>

        </div>
        <Button variant='ghost' size='sm' onClick={handleBack} className='exit'>
          <X className='icon' /> Edit Editor
        </Button>

      </nav>
      <section className='content'>
        <div className='panel'>
          <div className='panel-header'>
            <div className='panel-meta'>
              <p>Projects</p>

              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className='note'> Created by you</p>
            </div>
            <div className='panel-actions'>
              <Button
                size='sm'
                onClick={handleExport}
                className='export'
                disabled={!currentImage}
              >
                <Download className='w-4 h-4 mr-2' />Export
              </Button>
              <Button className='share' onClick={() => setIsShareModalOpen(true)} size='sm'>
                <Share2 className='w-4 h-4 mr-2' />
                Share
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
            {currentImage ? (

              <img src={currentImage} alt='AI Render' className='render-img' />
            ) : (
              <div className='render-placeholder'>
                {project?.sourceImage && (
                  <img src={project?.sourceImage} alt='Original'
                    className='render-fallback'
                  />
                )}
              </div>
            )}

            {isProcessing && (
              <div className='render-overlay'>
                <div className='rendering-card'>
                  <RefreshCcw className='spinner' />
                  <span className='title'>Rendering...</span>
                  <span className='subtitle'>Generating your 3D visualization</span>
                </div>
              </div>
            )}
          </div>
          {floorPlanError && (
            <p className='text-red-500 text-sm mt-2'>{floorPlanError}</p>
          )}
          <FloorPlanExportPanel
            floorPlanData={floorPlanData}
            imageBase64={project?.sourceImage || null}
          />
        </div>
        <div className='panel compare'>
          <div className='panel-header'>
            <div className='panel-meta'>
              <p>Comparison</p>
              <h3>Before and After</h3>
            </div>
            <div className='hint'>
              Drag to compare
            </div>
          </div>
          <div className='compare-stage'>
            {project?.sourceImage && currentImage ? (
              <ReactCompareSlider
                handle={<ReactCompareSliderHandle />}
                itemOne={<ReactCompareSliderImage src={project?.sourceImage} alt='before' />}
                itemTwo={<ReactCompareSliderImage src={currentImage} alt='after' />}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <div className='compare-fallback'>
                {project?.sourceImage && (
                  <img src={project.sourceImage} alt='Before' className='compare-img' />
                )}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Share Project</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Share Link Section */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Share this project with others:</p>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                <input
                  type="text"
                  value={getShareUrl()}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-md transition-all font-medium flex items-center gap-2 ${
                    isCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Project Details:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <span className="font-medium">Name:</span> {project?.name || `Residence ${id}`}
                </li>
                <li>
                  <span className="font-medium">Created:</span> {new Date(project?.timestamp || Date.now()).toLocaleDateString()}
                </li>
                <li>
                  <span className="font-medium">Status:</span> {currentImage ? 'Rendered' : 'Processing'}
                </li>
              </ul>
            </div>

            {/* Share Instructions */}
            <p className="text-xs text-gray-500 mb-4">
              Sharing this link allows others to view your project. They can download renders but cannot edit the original.
            </p>

            <button
              onClick={() => setIsShareModalOpen(false)}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualizerId;