import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router';
import { generate3DView } from '../../lib/ai.action';
import { createProject, getProjectById, updateProject } from '../../lib/puter.action';
import { Box, Download, RefreshCcw, Share2, TruckElectric, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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

  const handleBack = () => navigate('/');

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
              <p>Project</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className='note'> Created by you</p>
            </div>
            <div className='panel-actions'>
              <Button
                size='sm'
                onClick={() => { }}
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

          <div className={`render-area ${isProcessing ? 'is-procressing' : ''}`}>
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
        </div>
      </section>
    </div>
  );
}

export default VisualizerId;