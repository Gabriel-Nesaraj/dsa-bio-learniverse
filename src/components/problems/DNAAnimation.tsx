import React, { useEffect, useRef, useState } from 'react';

interface DNAAnimationProps {
  isRunning: boolean;
  sequence1?: string;
  sequence2?: string;
  type: 'alignment' | 'pattern-matching' | 'mutation';
  status: 'idle' | 'running' | 'success' | 'error';
}

const DNAAnimation: React.FC<DNAAnimationProps> = ({ 
  isRunning, 
  sequence1 = "ATGCTAGCTAGC", 
  sequence2 = "ATGCTTGCTAGC", 
  type,
  status 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const colors = {
    'A': '#3b82f6', // Blue
    'T': '#ef4444', // Red  
    'G': '#10b981', // Green
    'C': '#f59e0b'  // Amber
  };

  useEffect(() => {
    if (!isRunning) {
      setAnimationProgress(0);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationFrame: number;
    let progress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (type === 'alignment') {
        drawSequenceAlignment(ctx, canvas.width, canvas.height, progress);
      } else if (type === 'pattern-matching') {
        drawPatternMatching(ctx, canvas.width, canvas.height, progress);
      } else if (type === 'mutation') {
        drawMutation(ctx, canvas.width, canvas.height, progress);
      }

      progress += 0.02;
      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isRunning, type]);

  const drawSequenceAlignment = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
    const centerY = height / 2;
    const nucleotideWidth = 30;
    const maxVisible = Math.floor(width / nucleotideWidth) - 2;
    const visibleLength = Math.min(sequence1.length, maxVisible);
    
    // Draw sequences
    for (let i = 0; i < visibleLength; i++) {
      const x = 50 + i * nucleotideWidth;
      const animatedProgress = Math.max(0, Math.min(1, (progress * visibleLength - i) / 1));
      
      if (animatedProgress > 0) {
        // Sequence 1
        const nucleotide1 = sequence1[i];
        ctx.fillStyle = colors[nucleotide1 as keyof typeof colors] || '#9ca3af';
        ctx.globalAlpha = animatedProgress;
        ctx.fillRect(x, centerY - 60, 25, 25);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(nucleotide1, x + 12.5, centerY - 45);
        
        // Sequence 2
        const nucleotide2 = sequence2[i];
        ctx.fillStyle = colors[nucleotide2 as keyof typeof colors] || '#9ca3af';
        ctx.fillRect(x, centerY + 35, 25, 25);
        
        ctx.fillStyle = 'white';
        ctx.fillText(nucleotide2, x + 12.5, centerY + 50);
        
        // Connection line showing match/mismatch
        const isMatch = nucleotide1 === nucleotide2;
        ctx.strokeStyle = isMatch ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.globalAlpha = animatedProgress * 0.7;
        ctx.beginPath();
        ctx.moveTo(x + 12.5, centerY - 35);
        ctx.lineTo(x + 12.5, centerY + 35);
        ctx.stroke();
        
        // Match indicator
        if (isMatch && animatedProgress > 0.8) {
          ctx.fillStyle = '#10b981';
          ctx.globalAlpha = (animatedProgress - 0.8) * 5;
          ctx.beginPath();
          ctx.arc(x + 12.5, centerY, 8, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = 'white';
          ctx.font = '10px monospace';
          ctx.fillText('✓', x + 12.5, centerY + 3);
        }
      }
    }
    
    ctx.globalAlpha = 1;
  };

  const drawPatternMatching = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
    const centerY = height / 2;
    const nucleotideWidth = 25;
    const pattern = "ATG";
    const sequence = sequence1;
    
    // Draw main sequence
    for (let i = 0; i < sequence.length && i * nucleotideWidth < width - 100; i++) {
      const x = 50 + i * nucleotideWidth;
      const nucleotide = sequence[i];
      
      ctx.fillStyle = colors[nucleotide as keyof typeof colors] || '#9ca3af';
      ctx.fillRect(x, centerY, 20, 20);
      
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(nucleotide, x + 10, centerY + 13);
    }
    
    // Animated search window
    const searchPosition = Math.floor(progress * (sequence.length - pattern.length + 1));
    if (searchPosition < sequence.length - pattern.length + 1) {
      const windowX = 50 + searchPosition * nucleotideWidth;
      
      // Highlight current search window
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.strokeRect(windowX - 2, centerY - 2, pattern.length * nucleotideWidth - 4, 24);
      
      // Check if pattern matches
      const currentSubstring = sequence.substr(searchPosition, pattern.length);
      const isMatch = currentSubstring === pattern;
      
      if (isMatch) {
        ctx.fillStyle = '#10b981';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(windowX, centerY, pattern.length * nucleotideWidth - 4, 20);
        ctx.globalAlpha = 1;
      }
    }
    
    // Draw pattern below
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Pattern: ${pattern}`, 50, centerY + 50);
  };

  const drawMutation = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
    const centerY = height / 2;
    const nucleotideWidth = 30;
    const mutationIndex = 5; // Position where mutation occurs
    
    for (let i = 0; i < sequence1.length && i * nucleotideWidth < width - 100; i++) {
      const x = 50 + i * nucleotideWidth;
      const nucleotide = i === mutationIndex && progress > 0.5 ? 'T' : sequence1[i];
      
      // Animation effect at mutation site
      if (i === mutationIndex) {
        const pulseAlpha = 0.5 + 0.5 * Math.sin(progress * Math.PI * 4);
        ctx.globalAlpha = pulseAlpha;
        
        if (progress > 0.5) {
          ctx.fillStyle = '#ef4444'; // Red for mutation
        } else {
          ctx.fillStyle = colors[sequence1[i] as keyof typeof colors] || '#9ca3af';
        }
      } else {
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors[nucleotide as keyof typeof colors] || '#9ca3af';
      }
      
      ctx.fillRect(x, centerY, 25, 25);
      
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(nucleotide, x + 12.5, centerY + 17);
    }
    
    ctx.globalAlpha = 1;
  };

  return (
    <div className="relative w-full h-32 bg-card rounded-lg border overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      {isRunning && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground">
          {type === 'alignment' && 'Aligning sequences...'}
          {type === 'pattern-matching' && 'Searching pattern...'}
          {type === 'mutation' && 'Detecting mutations...'}
        </div>
      )}
      {status === 'success' && (
        <div className="absolute bottom-2 left-2 text-xs text-green-600 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
          Analysis complete
        </div>
      )}
      {status === 'error' && (
        <div className="absolute bottom-2 left-2 text-xs text-red-600 flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
          Analysis failed
        </div>
      )}
    </div>
  );
};

export default DNAAnimation;