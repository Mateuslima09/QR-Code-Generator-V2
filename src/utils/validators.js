/**
 * Validates a value for a given barcode format.
 * Returns null if valid, or an error key string if invalid.
 * @param {string} value
 * @param {'qr'|'code128'|'code39'|'ean13'|'upc'} type
 * @returns {null|string}
 */
export function validate(value, type) {
  switch (type) {
    case 'ean13':
      return /^\d{13}$/.test(value) ? null : 'errorEan13';
    case 'upc':
      return /^\d{12}$/.test(value) ? null : 'errorUpc';
    case 'code39': {
      // Code 39 valid chars: A-Z, 0-9, - . $ / + % space
      const code39Regex = /^[A-Z0-9\-\.\$\/\+\% ]+$/;
      return code39Regex.test(value) ? null : 'errorCode39';
    }
    case 'qr':
    case 'datamatrix':
    case 'code128':
    default:
      return null;
  }
}
