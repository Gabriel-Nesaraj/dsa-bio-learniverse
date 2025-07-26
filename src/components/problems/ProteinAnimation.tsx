import React, { useEffect, useRef, useState } from 'react';

interface ProteinAnimationProps {
  isRunning: boolean;
  sequence?: string;
  type: 'folding' | 'structure' | 'binding';
  status: 'idle' | 'running' | 'success' | 'error';
}

const ProteinAnimation: React.FC<ProteinAnimationProps> = ({ 
  isRunning, 
  sequence = "MKYFLLLMLLMWMVMTLM", 
  type,
  status 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Amino acid colors (simplified)
  const aminoAcidColors = {
    'M': '#e11d48', // Methionine - red
    'K': '#2563eb', // Lysine - blue
    'Y': '#ca8a04', // Tyrosine - yellow
    'F': '#7c3aed', // Phenylalanine - purple
    'L': '#059669', // Leucine - green
    'W': '#dc2626', // Tryptophan - red
    'V': '#ea580c', // Valine - orange
    'T': '#0891b2', // Threonine - cyan
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
      
      if (type === 'folding') {
        drawProteinFolding(ctx, canvas.width, canvas.height, progress);
      } else if (type === 'structure') {
        drawProteinStructure(ctx, canvas.width, canvas.height, progress);
      } else if (type === 'binding') {
        drawProteinBinding(ctx, canvas.width, canvas.height, progress);
      }

      progress += 0.015;
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

  const drawProteinFolding = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 40;
    
    for (let i = 0; i < sequence.length; i++) {
      const animatedProgress = Math.max(0, Math.min(1, (progress * sequence.length - i) / 2));
      
      if (animatedProgress > 0) {
        // Calculate folding position
        const linearX = 20 + i * 20;
        const linearY = centerY;
        
        // Final folded position (circular arrangement)
        const angle = (i / sequence.length) * Math.PI * 2;
        const foldedX = centerX + Math.cos(angle) * radius;
        const foldedY = centerY + Math.sin(angle) * radius;
        
        // Interpolate between linear and folded positions
        const foldProgress = Math.max(0, (progress - 0.3) / 0.7);
        const currentX = linearX + (foldedX - linearX) * foldProgress;
        const currentY = linearY + (foldedY - linearY) * foldProgress;
        
        // Draw amino acid
        const aminoAcid = sequence[i];
        ctx.fillStyle = aminoAcidColors[aminoAcid as keyof typeof aminoAcidColors] || '#64748b';
        ctx.globalAlpha = animatedProgress;
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        if (i > 0) {
          const prevLinearX = 20 + (i - 1) * 20;
          const prevLinearY = centerY;
          
          const prevAngle = ((i - 1) / sequence.length) * Math.PI * 2;
          const prevFoldedX = centerX + Math.cos(prevAngle) * radius;
          const prevFoldedY = centerY + Math.sin(prevAngle) * radius;
          
          const prevCurrentX = prevLinearX + (prevFoldedX - prevLinearX) * foldProgress;
          const prevCurrentY = prevLinearY + (prevFoldedY - prevLinearY) * foldProgress;
          
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.globalAlpha = animatedProgress * 0.6;
          ctx.beginPath();
          ctx.moveTo(prevCurrentX, prevCurrentY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        }
        
        // Draw amino acid label
        ctx.fillStyle = 'white';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = animatedProgress;
        ctx.fillText(aminoAcid, currentX, currentY + 3);
      }
    }
    
    ctx.globalAlpha = 1;
  };

  const drawProteinStructure = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw alpha helix representation
    const helixHeight = 80;
    const helixWidth = 200;
    const turns = 3;
    
    for (let i = 0; i <= 50; i++) {
      const animatedProgress = Math.max(0, Math.min(1, (progress * 50 - i) / 10));
      
      if (animatedProgress > 0) {
        const t = i / 50;
        const x = centerX - helixWidth/2 + t * helixWidth;
        const y = centerY + Math.sin(t * Math.PI * turns) * (helixHeight/4);
        const z = Math.cos(t * Math.PI * turns) * (helixHeight/4);
        
        // 3D effect
        const scale = 0.8 + 0.2 * ((z + helixHeight/4) / (helixHeight/2));
        const radius = 6 * scale;
        
        ctx.fillStyle = `hsl(${240 + t * 60}, 70%, ${50 + z * 0.5}%)`;
        ctx.globalAlpha = animatedProgress * scale;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw backbone connection
        if (i > 0) {
          const prevT = (i - 1) / 50;
          const prevX = centerX - helixWidth/2 + prevT * helixWidth;
          const prevY = centerY + Math.sin(prevT * Math.PI * turns) * (helixHeight/4);
          
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.globalAlpha = animatedProgress * 0.5;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    }
    
    ctx.globalAlpha = 1;
  };

  const drawProteinBinding = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw two proteins approaching each other
    const protein1X = centerX - 80 + progress * 40;
    const protein2X = centerX + 80 - progress * 40;
    
    // Protein 1
    ctx.fillStyle = '#3b82f6';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(protein1X, centerY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Protein 2
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(protein2X, centerY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Binding site visualization
    if (progress > 0.7) {
      const bindingProgress = (progress - 0.7) / 0.3;
      
      // Energy field
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.globalAlpha = bindingProgress * 0.6;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20 + i * 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Binding particles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + progress * Math.PI;
        const x = centerX + Math.cos(angle) * 30;
        const y = centerY + Math.sin(angle) * 30;
        
        ctx.fillStyle = '#fbbf24';
        ctx.globalAlpha = bindingProgress;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.globalAlpha = 1;
    
    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Protein A', protein1X, centerY + 40);
    ctx.fillText('Protein B', protein2X, centerY + 40);
    
    if (progress > 0.8) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('Binding Site', centerX, centerY - 40);
    }
  };

  return (
    <div className="relative w-full h-32 bg-card rounded-lg border overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      {isRunning && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground">
          {type === 'folding' && 'Folding protein...'}
          {type === 'structure' && 'Analyzing structure...'}
          {type === 'binding' && 'Simulating binding...'}
        </div>
      )}
      {status === 'success' && (
        <div className="absolute bottom-2 left-2 text-xs text-green-600 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
          Simulation complete
        </div>
      )}
      {status === 'error' && (
        <div className="absolute bottom-2 left-2 text-xs text-red-600 flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
          Simulation failed
        </div>
      )}
    </div>
  );
};

export default ProteinAnimation;