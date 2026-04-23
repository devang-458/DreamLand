import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const VisualizerId = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(`visualizer_${id}`);
      if (stored) {
        setImage(stored);
      }
    }
  }, [id]);

  if (!image) {
    return <div>Loading image...</div>;
  }

  return (
    <div>
      <h1>Visualizer</h1>
      <img src={image} alt="Uploaded floor plan" style={{ maxWidth: '100%' }} />
    </div>
  );
}

export default VisualizerId;