import { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

export default function DataMatrixCanvas({ value, size, fgColor, bgColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Use a high scale so the canvas has native resolution — no CSS stretching blur
      const scale = Math.max(8, Math.round((size || 200) / 20));

      bwipjs.toCanvas(canvas, {
        bcid: 'datamatrix',
        text: value,
        scale,
        barcolor: fgColor?.replace('#', '') ?? '000000',
        backgroundcolor: bgColor?.replace('#', '') ?? 'ffffff',
        paddingwidth: 0,
        paddingheight: 0,
      });

      // Let the canvas display at the requested size via CSS only — no stretching
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    } catch (e) {
      console.error('Error rendering Data Matrix to canvas:', e);
    }
  }, [value, size, fgColor, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        imageRendering: 'pixelated',
      }}
    />
  );
}
