import { forwardRef, useEffect, useState } from 'react';
import { fitCardText, fontOptions, type CardColors, type CardDetails, type CardFont } from '@/lib/card-design';

type Props = { details: CardDetails; font: CardFont; colors: CardColors | null; logo: string; artwork: boolean; fontReady: number };
export const CardPreview = forwardRef<SVGSVGElement, Props>(function CardPreview({ details, font, colors, logo, artwork, fontReady }, ref) {
  const family = fontOptions.find(item => item.key === font)?.family ?? 'Sora';
  const [layout, setLayout] = useState({
    name: { lines: [details.name], size: 34 }, company: { lines: [details.company], size: 16 },
    position: { lines: [details.position], size: 15 }, phone: { lines: [details.phone], size: 14 }, email: { lines: [details.email], size: 14 },
  });
  useEffect(() => {
    setLayout({
      name: fitCardText(details.name, family, 380, 34, 10, 2),
      company: fitCardText(details.company, family, 300, 16, 9, 3),
      position: fitCardText(details.position, family, 390, 15, 8, 2),
      phone: fitCardText(details.phone, family, 370, 14, 8, 1),
      email: fitCardText(details.email, family, 370, 14, 8, 3),
    });
  }, [details, family, fontReady]);
  // Palette token references are SSR-safe; client colors become explicit for standalone exports.
  const bg = colors?.background ?? 'var(--sage)', ink = colors?.text ?? 'var(--primary)', accent = colors?.accent ?? 'var(--coral)';
  const text = (key: keyof typeof layout, x: number, y: number) => <text data-field={key} x={x} y={y} fontSize={layout[key].size}>{layout[key].lines.map((line, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : layout[key].size * 1.3}>{line}</tspan>)}</text>;
  const positionY = 216 + (layout.name.lines.length - 1) * layout.name.size * 1.3 + 27;
  return <svg ref={ref} className="business-card card-svg" viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Business card">
    <rect width="700" height="400" fill={bg}/>
    {artwork && <g aria-hidden="true"><path fill={ink} opacity="0.09" d="M540 0H700V400H620C513 300 540 251 628 188C691 140 572 90 540 0Z"/><path fill={accent} d="M647 0H700V210C570 205 539 143 562 83C580 38 620 16 647 0Z"/><path fill={ink} opacity="0.87" d="M700 291V400H502C495 340 549 305 603 299C646 295 672 299 700 291Z"/></g>}
    <g fill={ink} fontFamily={family} fontWeight="500">
      {logo ? <image data-company-logo="true" href={logo} x="56" y="36" width="76" height="56" preserveAspectRatio="xMidYMid meet"/> : <path transform="translate(56 51) scale(1.2)" d="M1 14V6h4l5 8V6h4v8h-4L5 6v8zm14 0V6h4v8z"/>}
      {text('company', logo ? 148 : 89, 64)}
      {text('name', 56, 216)}
      {text('position', 56, positionY)}
      {details.phone && <><path transform="translate(57 319)" fill="none" stroke={ink} strokeWidth="1.3" d="M2 0C-3 6 5 14 12 12L9 8L6 9L3 6L4 3Z"/>{text('phone', 79, 331)}</>}
      {details.email && <><g transform="translate(57 346)" fill="none" stroke={ink} strokeWidth="1.3"><rect width="13" height="9"/><path d="M0 0L6.5 5L13 0"/></g>{text('email', 79, 355)}</>}
    </g>
  </svg>;
});
