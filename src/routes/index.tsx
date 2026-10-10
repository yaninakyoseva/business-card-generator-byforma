import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, BriefcaseBusiness, Building2, Check, CreditCard, Leaf, Mail, Phone, RotateCcw, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Forma — Business Card Studio' },
    { name: 'description', content: 'Create a personal business card in natural coral and sage palettes. Edit your details, see your card live, and download it.' },
    { property: 'og:title', content: 'Forma — Business Card Studio' },
    { property: 'og:description', content: 'A little card. A lasting impression. Design and download your own business card with Forma.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: CardStudio,
});
const initialDetails = { name: 'Alex Morgan', position: 'Product Designer', company: 'Studio North', phone: '+1 (415) 555-0123', email: 'alex@studionorth.co' };
const fields = [
  { key: 'name', label: 'Full name', icon: UserRound, placeholder: 'Your full name', type: 'text' },
  { key: 'position', label: 'Position', icon: BriefcaseBusiness, placeholder: 'Your job title', type: 'text' },
  { key: 'company', label: 'Company name', icon: Building2, placeholder: 'Your company', type: 'text' },
  { key: 'phone', label: 'Phone number', icon: Phone, placeholder: 'Your phone number', type: 'tel' },
  { key: 'email', label: 'Email address', icon: Mail, placeholder: 'you@company.com', type: 'email' },
] as const;
const themes = [{ key: 'sage', name: 'Soft sage' }, { key: 'coral', name: 'Warm coral' }, { key: 'paper', name: 'Natural linen' }, { key: 'forest', name: 'Deep forest' }] as const;
type Theme = typeof themes[number]['key'];
function CardArtwork() {
  return <svg className="card-art" viewBox="0 0 210 300" preserveAspectRatio="none" aria-hidden="true"><path className="art-light" d="M110 0H210V300H156C87 240 120 187 168 142C214 99 135 67 110 0Z"/><path className="art-coral" d="M175 0H210V157C116 154 85 105 107 59C120 32 151 16 175 0Z"/><path className="art-forest" d="M210 206V300H64C58 253 98 220 137 214C167 210 188 212 210 206Z"/></svg>;
}
function CompanyMark() { return <svg className="company-mark" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M1 14V6h4l5 8V6h4v8h-4L5 6v8zm14 0V6h4v8z"/></svg>; }
function CardStudio() {
  const [details, setDetails] = useState(initialDetails);
  const [theme, setTheme] = useState<Theme>('sage');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  async function downloadCard() {
    if (!cardRef.current) return;
    setDownloading(true); setDownloadError('');
    try {
      await document.fonts.ready;
      const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = 800;
      const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Image export is not available in this browser.');
      const css = getComputedStyle(document.documentElement);
      const color = (token: string) => css.getPropertyValue(token).trim();
      const bg = theme === 'coral' ? '--coral' : theme === 'paper' ? '--paper' : theme === 'forest' ? '--primary' : '--sage';
      const ink = theme === 'forest' ? '--paper' : theme === 'coral' ? '--foreground' : '--primary';
      ctx.fillStyle = color(bg); ctx.fillRect(0, 0, 1400, 800);
      ctx.save(); ctx.translate(840, 0); ctx.scale(560 / 210, 800 / 300);
      ctx.fillStyle = color('--art-light'); ctx.fill(new Path2D('M110 0H210V300H156C87 240 120 187 168 142C214 99 135 67 110 0Z'));
      ctx.fillStyle = color(theme === 'coral' ? '--sage' : '--coral'); ctx.fill(new Path2D('M175 0H210V157C116 154 85 105 107 59C120 32 151 16 175 0Z'));
      ctx.fillStyle = color(theme === 'forest' ? '--sage' : '--primary'); ctx.fill(new Path2D('M210 206V300H64C58 253 98 220 137 214C167 210 188 212 210 206Z')); ctx.restore();
      ctx.fillStyle = color(ink);
      function fitText(text: string, size: number, family: string, x: number, y: number, width: number) {
        let current = size; ctx.font = `500 ${current}px ${family}`;
        while (ctx.measureText(text).width > width && current > 12) { current -= 1; ctx.font = `500 ${current}px ${family}`; }
        ctx.fillText(text, x, y);
      }
      ctx.save(); ctx.translate(112, 92); ctx.scale(2.7, 2.7); ctx.fill(new Path2D('M1 14V6h4l5 8V6h4v8h-4L5 6v8zm14 0V6h4v8z')); ctx.restore();
      fitText(details.company, 32, 'Sora', 174, 128, 650);
      fitText(details.name, 67, 'Sora', 112, 421, 810);
      fitText(details.position, 30, 'Manrope', 112, 467, 790);
      fitText(details.phone, 27, 'Manrope', 149, 601, 830);
      fitText(details.email, 27, 'Manrope', 149, 646, 830);
      ctx.strokeStyle = color(ink); ctx.lineWidth = 2.5;
      ctx.strokeRect(113, 627, 23, 16); ctx.beginPath(); ctx.moveTo(113, 627); ctx.lineTo(124.5, 636); ctx.lineTo(136, 627); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(115, 578); ctx.bezierCurveTo(110, 590, 124, 604, 137, 601); ctx.lineTo(132, 594); ctx.lineTo(127, 596); ctx.lineTo(120, 589); ctx.lineTo(122, 584); ctx.closePath(); ctx.stroke();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Your card could not be exported.')), 'image/png'));
      const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${details.name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'forma'}-business-card.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setDownloadError(error instanceof Error ? error.message : 'Your card could not be exported. Please try again.'); }
    finally { setDownloading(false); }
  }
  return <div>
    <header className="studio-header"><a href="/" className="brand" aria-label="Forma home"><span className="brand-icon"><CreditCard size={21}/></span><span>forma<span className="brand-dot">.</span></span></a><div className="header-note">Small details. Lasting impressions.<ArrowUpRight size={14}/></div></header>
    <main className="workspace">
      <div className="page-heading"><div><h1>Business Card Studio</h1><p>A little card. A whole lot of you.</p></div><Sparkles className="text-primary" size={23} strokeWidth={1.4}/></div>
      <div className="studio-layout">
        <section className="editor" aria-labelledby="details-heading"><div className="editor-heading"><span className="step">01</span><h2 id="details-heading">Make it yours</h2></div>
          <form className="form-fields" onSubmit={event => event.preventDefault()}>{fields.map(({ key, label, icon: Icon, placeholder, type }) => <div key={key}><label className="field-label" htmlFor={key}>{label}</label><div className="input-wrap"><Icon strokeWidth={1.5}/><Input id={key} type={type} value={details[key]} placeholder={placeholder} onChange={event => setDetails(previous => ({ ...previous, [key]: event.target.value }))}/></div></div>)}</form>
          <div className="editor-bottom"><Button variant="ghost" className="w-full text-muted-foreground text-xs" onClick={() => { setDetails({ name:'', position:'', company:'', phone:'', email:'' }); }}><RotateCcw size={13}/>Clear details</Button></div>
        </section>
        <section aria-label="Card preview and design"><div className="preview-heading"><span className="section-label">Your card, coming to life</span><span className="live-badge">Live preview</span></div>
          <div className="preview-stage"><div className={`business-card theme-${theme}`} ref={cardRef} aria-label="Business card"><CardArtwork/><div className="card-content"><div className="company-line"><CompanyMark/><span>{details.company || 'Company name'}</span></div><div className="card-person"><h2>{details.name || 'Your name'}</h2><p>{details.position || 'Your position'}</p></div><div className="card-contact">{details.phone && <div><Phone/><span>{details.phone}</span></div>}{details.email && <div><Mail/><span>{details.email}</span></div>}</div></div></div><div className="card-dimensions"><CreditCard size={12}/>3.5 × 2 in<span>·</span>Standard business card</div></div>
          <div className="appearance"><div className="appearance-heading"><h2>A color that feels like you</h2><span>Four natural palettes</span></div><div className="theme-grid">{themes.map(item => <div className="theme-option" key={item.key}><Button variant="ghost" className="theme-button" aria-label={`Use ${item.name} palette`} aria-pressed={theme === item.key} onClick={() => setTheme(item.key)}><div className={`mini-card theme-${item.key}`}><CardArtwork/><span className="mini-text">Studio North</span><span className="mini-lines"/></div></Button><div className="theme-name"><span>{item.name}</span>{theme === item.key && <Check/>}</div></div>)}</div></div>
          <div className="export-row"><span className="export-note"><ShieldCheck size={14}/>Your details stay with you.</span><Button className="download-button" onClick={downloadCard} disabled={downloading}><ArrowDownToLine/>{downloading ? 'Preparing card…' : 'Download card'}</Button></div>{downloadError && <p role="alert" className="text-destructive text-xs mt-3">{downloadError}</p>}
        </section>
      </div>
      <footer className="studio-footer"><span>Made for your next introduction.</span><span className="footer-signature"><Leaf/>A little more personal.</span></footer>
    </main>
  </div>;
}
