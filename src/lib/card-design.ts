import soraAsset from '@/assets/sora.ttf.asset.json';
import manropeAsset from '@/assets/manrope.ttf.asset.json';

export const initialDetails = { name: 'Alex Morgan', position: 'Product Designer', company: 'Studio North', phone: '+1 (415) 555-0123', email: 'alex@studionorth.co' };
export type CardDetails = typeof initialDetails;
export type CardColors = { background: string; text: string; accent: string };
export const fontOptions = [
  { key: 'sora', name: 'Sora', family: 'Sora', url: soraAsset.url },
  { key: 'manrope', name: 'Manrope', family: 'Manrope', url: manropeAsset.url },
  { key: 'georgia', name: 'Georgia', family: 'Georgia', url: '' },
  { key: 'mono', name: 'Monospace', family: 'monospace', url: '' },
] as const;
export type CardFont = typeof fontOptions[number]['key'];
export const palettes = [
  { key: 'sage', name: 'Soft sage', background: '--sage', text: '--primary', accent: '--coral' },
  { key: 'coral', name: 'Warm coral', background: '--coral', text: '--foreground', accent: '--sage' },
  { key: 'paper', name: 'Natural linen', background: '--paper', text: '--primary', accent: '--coral' },
  { key: 'forest', name: 'Deep forest', background: '--primary', text: '--paper', accent: '--coral' },
] as const;
export type PaletteKey = typeof palettes[number]['key'];
export const limits = { name: 60, position: 80, company: 80, phone: 32, email: 100 };

export function tokenHex(token: string) {
  const canvas = document.createElement('canvas'); canvas.width = 1; canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser does not support card colors.');
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  ctx.fillRect(0, 0, 1, 1);
  const rgb = ctx.getImageData(0, 0, 1, 1).data;
  return '#' + Array.from(rgb).slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('');
}
export function paletteColors(key: PaletteKey): CardColors {
  const palette = palettes.find(item => item.key === key) ?? palettes[0];
  return { background: tokenHex(palette.background), text: tokenHex(palette.text), accent: tokenHex(palette.accent) };
}
export function contrastRatio(a: string, b: string) {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export type TextLayout = { lines: string[]; size: number };
export function fitCardText(text: string, family: string, width: number, maxSize: number, minSize: number, maxLines = 1): TextLayout {
  const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
  if (!ctx) return { lines: [text], size: minSize };
  const wrap = (size: number) => {
    ctx.font = `500 ${size}px "${family}"`;
    const lines: string[] = []; let line = '';
    // Break even unspaced strings without dropping characters.
    for (const char of Array.from(text)) {
      if (line && ctx.measureText(line + char).width > width) { lines.push(line.trimEnd()); line = char; }
      else line += char;
    }
    if (line) lines.push(line.trimEnd());
    return lines;
  };
  for (let size = maxSize; size >= minSize; size--) {
    const lines = wrap(size);
    if (lines.length <= maxLines) return { lines, size };
  }
  const lines = wrap(minSize);
  // The finite input limits make this exceptional, but keep the drawing bounded.
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let last = lines[maxLines - 1] ?? '';
    while (last && ctx.measureText(last + '…').width > width) last = last.slice(0, -1);
    lines[maxLines - 1] = last + '…';
  }
  return { lines, size: minSize };
}
const fontData = new Map<string, Promise<string>>();
export async function loadFont(font: CardFont) {
  const option = fontOptions.find(item => item.key === font) ?? fontOptions[0];
  if (!option.url) return '';
  let data = fontData.get(font);
  if (!data) {
    data = (async () => {
      const response = await fetch(option.url);
      if (!response.ok) throw new Error('The selected font could not be loaded. Please try again.');
      const blob = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('The font could not be read.')); reader.readAsDataURL(blob);
      });
      const face = new FontFace(option.family, `url(${dataUrl})`, { weight: '100 900' });
      await face.load(); document.fonts.add(face);
      return dataUrl;
    })();
    fontData.set(font, data);
    data.catch(() => fontData.delete(font));
  }
  return data;
}
export async function serializeCard(svg: SVGSVGElement, font: CardFont) {
  const data = await loadFont(font);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '1400'); clone.setAttribute('height', '800');
  clone.removeAttribute('class'); clone.removeAttribute('role'); clone.removeAttribute('aria-label');
  if (data) {
    const family = fontOptions.find(item => item.key === font)?.family ?? 'Sora';
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `@font-face{font-family:'${family}';src:url('${data}') format('truetype');font-weight:100 900;}`;
    clone.prepend(style);
  }
  return new XMLSerializer().serializeToString(clone);
}
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function svgToPng(source: string) {
  const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Your card image could not be created.')); image.src = url; });
    const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = 800;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('PNG export is not available in this browser.');
    ctx.drawImage(image, 0, 0, 1400, 800);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Your card could not be exported.')), 'image/png'));
  } finally { URL.revokeObjectURL(url); }
}
export async function readLogo(file: File): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Choose a PNG, JPG, or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Choose a logo smaller than 5 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('This image could not be opened. Choose another logo.')); image.src = url; });
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error('Choose a logo with fewer than 40 million pixels.');
    const scale = Math.min(1, 1024 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Logo upload is not available in this browser.');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } finally { URL.revokeObjectURL(url); }
}
