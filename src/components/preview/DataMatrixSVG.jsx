import { useMemo } from 'react';
import bwipjs from 'bwip-js';

export default function DataMatrixSVG({ value, size, fgColor, bgColor }) {
  const svgHtml = useMemo(() => {
    if (!value) return '';
    try {
      // bwip-js accepts hex color codes. Let's make sure they are in correct format.
      // If we pass hex colors to barcolor and backgroundcolor, bwip-js handles it.
      return bwipjs.toSVG({
        bcid: 'datamatrix',
        text: value,
        scale: 4,
        barcolor: fgColor,
        backgroundcolor: bgColor,
        paddingwidth: 0,
        paddingheight: 0,
      });
    } catch (e) {
      console.error('Error rendering Data Matrix:', e);
      return '';
    }
  }, [value, fgColor, bgColor]);

  if (!svgHtml) {
    return (
      <div style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>
        Render Error
      </div>
    );
  }

  // To make sure it fits and scales nicely, we extract the inner SVG or wrap it.
  // bwipjs toSVG returns something like: <svg ...>...</svg>
  // We can wrap it in a div that controls the size.
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="datamatrix-svg-container"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .datamatrix-svg-container svg {
          width: 100% !important;
          height: 100% !important;
          max-width: 100%;
          max-height: 100%;
        }
      ` }} />
      <div 
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center' }} 
        dangerouslySetInnerHTML={{ __html: svgHtml }} 
      />
    </div>
  );
}
