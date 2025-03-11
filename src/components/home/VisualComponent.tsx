
import { useEffect, useRef } from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const VisualComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // DNA data representation (simplified for visualization)
  const dnaSequence = "ATGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG";
  
  // Colors for nucleotides
  const colors = {
    'A': '#3b82f6', // Blue
    'T': '#ef4444', // Red
    'G': '#10b981', // Green
    'C': '#f59e0b'  // Amber
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    const setupCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw DNA visualization
      drawDNAVisualization();
    };

    // Handle window resize
    const handleResize = () => {
      setupCanvas();
    };

    // Initial setup
    setupCanvas();
    window.addEventListener('resize', handleResize);

    // Animation
    let animationFrame: number;
    let offset = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDNAVisualization(offset);
      offset += 0.5;
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Function to draw the DNA visualization
  const drawDNAVisualization = (offset = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const amplitude = height / 6;
    const frequency = 0.02;
    const sequenceLength = dnaSequence.length;
    
    // Draw curves
    ctx.lineWidth = 2;
    
    // Draw first strand
    ctx.beginPath();
    ctx.moveTo(0, centerY + Math.sin(offset * frequency) * amplitude);
    
    for (let i = 0; i < width; i += 5) {
      ctx.lineTo(
        i, 
        centerY + Math.sin((i + offset) * frequency) * amplitude
      );
    }
    
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.stroke();
    
    // Draw second strand
    ctx.beginPath();
    ctx.moveTo(0, centerY + Math.sin((offset + Math.PI) * frequency) * amplitude);
    
    for (let i = 0; i < width; i += 5) {
      ctx.lineTo(
        i, 
        centerY + Math.sin((i + offset + Math.PI) * frequency) * amplitude
      );
    }
    
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.stroke();
    
    // Draw connecting bases
    const baseWidth = 10;
    for (let i = 0; i < width; i += 30) {
      const wavePos1 = centerY + Math.sin((i + offset) * frequency) * amplitude;
      const wavePos2 = centerY + Math.sin((i + offset + Math.PI) * frequency) * amplitude;
      
      const sequenceIndex = Math.floor((i / width) * sequenceLength) % sequenceLength;
      const nucleotide = dnaSequence[sequenceIndex];
      const complementNucleotide = getComplementNucleotide(nucleotide);
      
      // Draw connecting line
      ctx.beginPath();
      ctx.moveTo(i, wavePos1);
      ctx.lineTo(i, wavePos2);
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.3)';
      ctx.stroke();
      
      // Draw nucleotides
      ctx.beginPath();
      ctx.arc(i, wavePos1, baseWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = colors[nucleotide as keyof typeof colors] || '#9ca3af';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(i, wavePos2, baseWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = colors[complementNucleotide as keyof typeof colors] || '#9ca3af';
      ctx.fill();
    }
  };

  // Helper function to get complementary nucleotide
  const getComplementNucleotide = (nucleotide: string): string => {
    switch (nucleotide) {
      case 'A': return 'T';
      case 'T': return 'A';
      case 'G': return 'C';
      case 'C': return 'G';
      default: return 'N';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-secondary">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <AnimatedContainer>
            <h2 className="text-3xl font-bold mb-4">Visualize Algorithms in Action</h2>
            <p className="text-muted-foreground">
              See how algorithms process biological data in real-time with our interactive visualizations.
            </p>
          </AnimatedContainer>
        </div>
        
        <AnimatedContainer animation="blur" className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full bg-card"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 glass-effect">
              <div className="flex flex-wrap gap-4 justify-center">
                {['DNA Sequence Alignment', 'Protein Folding', 'Gene Expression Analysis', 'Phylogenetic Trees'].map((algo) => (
                  <div key={algo} className="px-3 py-1.5 rounded-full bg-white/20 text-sm font-medium">
                    {algo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default VisualComponent;
