import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, BriefcaseBusiness, Building2, Check, CreditCard, ImagePlus, Leaf, Mail, Phone, RotateCcw, ShieldCheck, Sparkles, Trash2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CardPreview } from '@/components/card-studio/card-preview';
import { contrastRatio, fontOptions, initialDetails, limits, loadFont, paletteColors, palettes, readLogo, saveBlob, serializeCard, svgToPng, type CardColors, type CardFont, type PaletteKey } from '@/lib/card-design';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Forma — Business Card Studio' },
    { name: 'description', content: 'Design a personal business card with custom fonts, colors, and your company logo. Download a matching PNG or editable SVG.' },
    { property: 'og:title', content: 'Forma — Business Card Studio' },
    { property: 'og:description', content: 'Your details, your colors, your logo. Create and download a naturally personal business card.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: CardStudio,
});
const fields = [
  { key: 'name', label: 'Full name', icon: UserRound, placeholder: 'Your full name', type: 'text' },
  { key: 'position', label: 'Position', icon: BriefcaseBusiness, placeholder: 'Your job title', type: 'text' },
  { key: 'company', label: 'Company name', icon: Building2, placeholder: 'Your company', type: 'text' },
  { key: 'phone', label: 'Phone number', icon: Phone, placeholder: 'Your phone number', type: 'tel' },
  { key: 'email', label: 'Email address', icon: Mail, placeholder: 'you@company.com', type: 'email' },
] as const;
function CardArtwork() { return <svg className="card-art" viewBox="0 0 210 300" preserveAspectRatio="none" aria-hidden="true"><path className="art-light" d="M110 0H210V300H156C87 240 120 187 168 142C214 99 135 67 110 0Z"/><path className="art-coral" d="M175 0H210V157C116 154 85 105 107 59C120 32 151 16 175 0Z"/><path className="art-forest" d="M210 206V300H64C58 253 98 220 137 214C167 210 188 212 210 206Z"/></svg>; }
function CardStudio() {
  const [details, setDetails] = useState(initialDetails);
  const [theme, setTheme] = useState<PaletteKey | 'custom'>('sage');
  const [colors, setColors] = useState<CardColors | null>(null);
  const [font, setFont] = useState<CardFont>('sora');
  const [fontReady, setFontReady] = useState(0);
  const [fontLoading, setFontLoading] = useState(true);
  const [fontError, setFontError] = useState('');
  const [logo, setLogo] = useState('');
  const [logoName, setLogoName] = useState('');
  const [logoError, setLogoError] = useState('');
  const [logoLoading, setLogoLoading] = useState(false);
  const [artwork, setArtwork] = useState(true);
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadVersion = useRef(0);
  useEffect(() => { setColors(paletteColors('sage')); }, []);
  useEffect(() => {
    let active = true; setFontLoading(true); setFontError('');
    loadFont(font).then(() => { if (active) { setFontReady(v => v + 1); setFontLoading(false); } }).catch(error => { if (active) { setFontLoading(false); setFontError(error instanceof Error ? error.message : 'The font could not be loaded.'); } });
    return () => { active = false; };
  }, [font]);
  function resetDesign() { setTheme('sage'); setColors(paletteColors('sage')); setFont('sora'); setArtwork(true); setDownloadError(''); setDownloaded(false); }
  function removeLogo() { uploadVersion.current += 1; setLogo(''); setLogoName(''); setLogoError(''); setLogoLoading(false); if (fileRef.current) fileRef.current.value = ''; }
  async function uploadLogo(file: File | undefined) {
    if (!file) return;
    const version = ++uploadVersion.current;
    setLogoLoading(true); setLogoError('');
    try { const data = await readLogo(file); if (version === uploadVersion.current) { setLogo(data); setLogoName(file.name); } }
    catch (error) { if (version === uploadVersion.current) setLogoError(error instanceof Error ? error.message : 'The logo could not be opened.'); }
    finally { if (version === uploadVersion.current) { setLogoLoading(false); if (fileRef.current) fileRef.current.value = ''; } }
  }
  async function downloadCard() {
    const svg = svgRef.current; if (!svg) return;
    setDownloading(true); setDownloadError(''); setDownloaded(false);
    try {
      const source = await serializeCard(svg, font);
      const blob = format === 'svg' ? new Blob([source], { type: 'image/svg+xml;charset=utf-8' }) : await svgToPng(source);
      const filename = details.name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'forma';
      saveBlob(blob, `${filename}-business-card.${format}`); setDownloaded(true);
    } catch (error) { setDownloadError(error instanceof Error ? error.message : 'Your card could not be exported. Please try again.'); }
    finally { setDownloading(false); }
  }
  const lowContrast = colors ? contrastRatio(colors.background, colors.text) < 4.5 : false;
  return <div>
    <header className="studio-header"><a href="/" className="brand" aria-label="Forma home"><span className="brand-icon"><CreditCard size={21}/></span><span>forma<span className="brand-dot">.</span></span></a><div className="header-note">Small details. Lasting impressions.<ArrowUpRight size={14}/></div></header>
    <main className="workspace"><div className="page-heading"><div><h1>Business Card Studio</h1><p>A little card. A whole lot of you.</p></div><Sparkles className="text-primary" size={23} strokeWidth={1.4}/></div>
      <div className="studio-layout">
        <section className="editor" aria-labelledby="details-heading"><div className="editor-heading"><span className="step">01</span><h2 id="details-heading">Make it yours</h2></div>
          <form className="form-fields" onSubmit={event => event.preventDefault()}>{fields.map(({ key, label, icon: Icon, placeholder, type }) => <div key={key}><div className="field-label-row"><label className="field-label" htmlFor={key}>{label}</label><span className="field-count" aria-label={`${label} character count`}>{details[key].length}/{limits[key]}</span></div><div className="input-wrap"><Icon strokeWidth={1.5}/><Input id={key} type={type} maxLength={limits[key]} value={details[key]} placeholder={placeholder} onChange={event => { setDetails(previous => ({ ...previous, [key]: event.target.value.slice(0, limits[key]) })); setDownloaded(false); }}/></div></div>)}</form>
          <div className="logo-controls"><label className="field-label" htmlFor="company-logo">Company logo</label><input ref={fileRef} id="company-logo" type="file" className="sr-only" accept="image/png,image/jpeg,image/webp" onChange={event => void uploadLogo(event.target.files?.[0])}/><div className="logo-upload-row">{logo && <img className="logo-thumbnail" src={logo} alt="Uploaded company logo"/>}<Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={logoLoading}><ImagePlus/>{logoLoading ? 'Opening logo…' : logo ? 'Replace logo' : 'Upload logo'}</Button>{logo && <Button variant="ghost" size="icon" aria-label="Remove company logo" title="Remove company logo" onClick={removeLogo}><Trash2/></Button>}</div><p className="upload-note">{logoName || 'PNG, JPG or WebP · up to 5 MB'}</p>{logoError && <p className="control-error" role="alert">{logoError}</p>}</div>
          <div className="editor-bottom"><Button variant="ghost" className="w-full text-muted-foreground text-xs" onClick={() => { setDetails({ name:'', position:'', company:'', phone:'', email:'' }); setDownloaded(false); }}><RotateCcw size={13}/>Clear details</Button></div>
        </section>
        <section aria-label="Card preview and design"><div className="preview-heading"><span className="section-label">Your card, coming to life</span><span className="live-badge">Live preview</span></div>
          <div className="preview-stage"><CardPreview ref={svgRef} details={details} font={font} colors={colors} logo={logo} artwork={artwork} fontReady={fontReady}/><div className="card-dimensions"><CreditCard size={12}/>3.5 × 2 in<span>·</span>Standard business card</div></div>
          <div className="appearance"><div className="appearance-heading"><h2>A color that feels like you</h2><Button variant="ghost" size="sm" aria-label="Reset design" title="Reset font, colors and artwork" onClick={resetDesign}><RotateCcw/>Reset design</Button></div><div className="theme-grid">{palettes.map(item => <div className="theme-option" key={item.key}><Button variant="ghost" className="theme-button" aria-label={`Use ${item.name} palette`} aria-pressed={theme === item.key} onClick={() => { setTheme(item.key); setColors(paletteColors(item.key)); setDownloaded(false); }}><div className={`mini-card theme-${item.key}`}><CardArtwork/><span className="mini-text">Studio North</span><span className="mini-lines"/></div></Button><div className="theme-name"><span>{item.name}</span>{theme === item.key && <Check/>}</div></div>)}</div></div>
          <div className="customization"><div className="font-control"><label className="field-label" htmlFor="card-font">Card font</label><select id="card-font" className="studio-select" value={font} onChange={event => { setFont(event.target.value as CardFont); setDownloaded(false); }}>{fontOptions.map(item => <option value={item.key} key={item.key}>{item.name}</option>)}</select></div><fieldset className="color-controls"><legend className="field-label">Custom colors</legend>{(['background','text','accent'] as const).map(key => <label className="color-control" key={key}><input type="color" aria-label={`${key.charAt(0).toUpperCase() + key.slice(1)} color`} value={colors?.[key] ?? '#000000'} disabled={!colors} onChange={event => { const value = event.target.value; setColors(previous => previous ? { ...previous, [key]: value } : previous); setTheme('custom'); setDownloaded(false); }}/><span>{key === 'text' ? 'Text' : key === 'accent' ? 'Accent' : 'Background'}</span></label>)}</fieldset></div>
          <div className="artwork-control"><label htmlFor="card-artwork">Organic artwork</label><Switch id="card-artwork" checked={artwork} onCheckedChange={value => { setArtwork(value); setDownloaded(false); }}/></div>
          {lowContrast && <p className="contrast-warning" role="status">Low text contrast. Choose more distinct text and background colors.</p>}{fontError && <p className="control-error" role="alert">{fontError}</p>}
          <div className="export-row"><span className="export-note"><ShieldCheck size={14}/>Your details stay with you.</span><div className="export-actions"><div className="format-toggle" role="group" aria-label="Export format"><Button size="sm" variant={format === 'png' ? 'secondary' : 'ghost'} aria-pressed={format === 'png'} onClick={() => { setFormat('png'); setDownloaded(false); }}>PNG</Button><Button size="sm" variant={format === 'svg' ? 'secondary' : 'ghost'} aria-pressed={format === 'svg'} onClick={() => { setFormat('svg'); setDownloaded(false); }}>SVG</Button></div><Button className="download-button" onClick={downloadCard} disabled={downloading || logoLoading || fontLoading || Boolean(fontError)}>{downloaded ? <Check/> : <ArrowDownToLine/>}{downloading ? 'Preparing…' : fontLoading ? 'Loading font…' : 'Download card'}</Button></div></div>{downloadError && <p role="alert" className="control-error">{downloadError}</p>}
        </section>
      </div><footer className="studio-footer"><span>Made for your next introduction.</span><span className="footer-signature"><Leaf/>A little more personal.</span></footer>
    </main>
  </div>;
}
