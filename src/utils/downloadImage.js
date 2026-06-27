/**
 * Downloads a QR Code (SVG) or Barcode (SVG) as a PNG image.
 * @param {HTMLElement} container - The DOM element containing the SVG or canvas
 * @param {string} filename - The filename without extension
 */
export async function downloadImage(container, filename = 'code') {
  const safeFilename = filename.replace(/[\\/:*?"<>|\n\r]/g, '-').slice(0, 100).trim() || 'code';

  const svg = container.querySelector('svg');
  const canvas = container.querySelector('canvas');

  if (svg) {
    await downloadSvgAsPng(svg, safeFilename);
  } else if (canvas) {
    downloadCanvasAsPng(canvas, safeFilename);
  }
}

/**
 * Converts a QR Code (SVG) or Barcode (SVG) to a PNG blob.
 * @param {HTMLElement} container - The DOM element containing the SVG or canvas
 * @returns {Promise<Blob>}
 */
export async function getPngBlob(container) {
  const svg = container.querySelector('svg');
  const canvas = container.querySelector('canvas');

  if (svg) {
    return getSvgBlob(svg);
  } else if (canvas) {
    return getCanvasBlob(canvas);
  }
  return null;
}

function getSvgBlob(svgEl) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgEl.width?.baseVal?.value || svgEl.viewBox?.baseVal?.width || 256;
      canvas.height = svgEl.height?.baseVal?.value || svgEl.viewBox?.baseVal?.height || 256;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into image'));
    };
    img.src = url;
  });
}

function getCanvasBlob(canvasEl) {
  return new Promise((resolve) => {
    canvasEl.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

async function downloadSvgAsPng(svgEl, filename) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgEl.width?.baseVal?.value || svgEl.viewBox?.baseVal?.width || 256;
      canvas.height = svgEl.height?.baseVal?.value || svgEl.viewBox?.baseVal?.height || 256;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      canvas.toBlob((blob) => {
        triggerDownloadBlob(blob, filename + '.png');
        resolve();
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into image'));
    };
    img.src = url;
  });
}

function downloadCanvasAsPng(canvasEl, filename) {
  canvasEl.toBlob((blob) => {
    triggerDownloadBlob(blob, filename + '.png');
  }, 'image/png');
}

export function triggerDownloadBlob(blob, filename) {
  if (!blob) return;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
