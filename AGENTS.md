<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Card studio
- Keep the business card editor and live preview client-side on the index route; personal contact details do not need a server or persistent storage.
- Define default palette colors in the shared stylesheet and apply runtime customization through card drawing properties; a single SVG coordinate system drives the preview, SVG export, and rasterized PNG export so layouts stay identical.
- Normalize private runtime logo uploads to embedded PNG data in memory; exported cards must be self-contained without uploading contact information or logos to a service.
- Load bundled card font assets in the browser and embed them into SVG downloads; fit bounded text inside fixed drawing regions after fonts load.
