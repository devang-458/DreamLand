import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router';
import { generate3DView } from '../../lib/ai.action';
import { createProject, getProjectById, updateProject } from '../../lib/puter.action';
import { analyzeFloorPlan, validateFloorPlan } from '../../lib/floorplan.analysis';
import { Box, Download, RefreshCcw, Share2, TruckElectric, X } from 'lucide-react';
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

  const handleBack = () => navigate('/');

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
          ispublic: item.isPublic ?? false
        }

        const saved = await createProject({ item: updatedItem, visibility: 'private' })

        if (saved) {
          setProjects(saved)
          setCurrentImage(saved.renderedImage || result.renderImage)
        }

        // Save the rendered image to the project
        if (id) {
          await updateProject({
            item: {
              id,
              name,
              sourceImage: initialImage,
              renderedImage: result.renderImage,
              timestamp: Date.now()
            },
            visibility: 'private'
          });
        }
        setProjects(updatedItem)

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
      const fetchProjects = await getProjectById({ id });

      if (!isMounted) return;

      setProjects(fetchProjects);
      setCurrentImage(fetchProjects?.renderedImage || null);
      setIsProjectsLoading(false);
      hasInitialGenerated.current = false;
    }

    loadProject();

    return () => { isMounted = false };
  }, [id])

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
              <Button className='share' onClick={() => { }} size='sm'>
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
    </div>
  );
}

export default VisualizerId;