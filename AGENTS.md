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
- Define palette and card artwork colors in the shared stylesheet; preview and browser-only PNG export derive their colors from the same tokens.
