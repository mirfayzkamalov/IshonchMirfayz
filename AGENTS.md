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

- Keep retailer-sourced catalog records in `src/lib/catalog-products.ts` and exact image provenance in `src/lib/catalog-provenance.json`; imported asset pointers keep model/photo pairs auditable.
- Upgrade the existing browser demo catalog once through `catalog-upgrade.ts`, preserving custom admin records and subsequent deletions; this avoids silently overwriting saved edits.
