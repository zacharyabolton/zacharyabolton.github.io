# Zac Bolton’s portfolio

Static HTML, CSS, and JavaScript, hosted on GitHub Pages at https://zacbolton.io.
No build step or package installation is required.

## Preview

From this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. Changes appear on refresh.

Run the shuffle timing/geometry checks with `node --test tests/*.test.cjs`.

## Pages

- `index.html`: introduction, selected work, earlier projects, and contact.
- `about-me.html`: personal story and AI safety direction.
- `evaluation-practice.html`: evaluation infrastructure, teaching, and adoption.
- `behavioral-evaluations.html`: employer work and independent experiments, with scope and limits.
- `resume.html`: browser and print résumé. The download is `public/Zachary_A_Bolton_Resume.pdf`.
- `animation.html`: original full-screen multiplication playground.
- Existing research URLs remain available, including SBERT and the two earlier studies.

The new pages share `stylesheets/site.css` and `scripts/site.js`. The latter animates
modular multiplication on a canvas; it honors reduced motion and stops when hidden
or outside the viewport. Both canvases use `scripts/multiplication-drawing.js`
for a 750 ms shuffle reveal, independent of the number of distinct connections.
Self-loops and duplicate lines are skipped; the current connection grows smoothly.
Reduced motion skips the reveal. Navigation and content work without JavaScript.

About, résumé, and the two evaluation pages share the subdued handwritten
background. `scripts/sketch-background.js` replays its entrance fade on every
visit; reduced-motion preferences disable the fade, and print omits the backdrop.

## Updating

Keep the HTML résumé and its PDF aligned. Print `resume.html` to A4 PDF with browser
headers/footers disabled and CSS page size enabled. The print stylesheet controls
spacing and excludes navigation. Check the exported PDF before replacing the download.

Update social metadata and `public/social-card.png` when the headline changes.
Shared headers and footers are plain HTML; keep them consistent across the five new
pages. Preserve the original research result tables when correcting interpretation.

## Evidence notes

The profile describes TF-IDF and DeBERTa comparisons following Zac’s correction.
The linked harmful-request-classification repository currently also reports Laya
experiments; that discrepancy needs reconciliation with Zac before adding any Laya
claim to this site. The Inspect repository includes the résumé-injection extension and a report-only
Petri work sample. The supplied hiring-test harness and raw logs are not redistributed.

This redesign does not publish private employer code, experiment logs, or recruitment
assignments. Employer work is summarized, with links to the public study and tutorial.

The résumé emphasizes durable contributions and dated release milestones rather
than moving CI-volume or contributor counts. Language rollout figures refer to
October 2026; the crosstalk model’s deployment was shadow-only. Kid Chess continuity
and staff-retention figures reflect Zac’s correction. The direct-address guard
was developed by Zac and integrated into the production codebase behind a flag
by a colleague; the site does not claim a verified live incident reduction.

## Background-click butterflies

The main portfolio, evaluation pages, résumé, and older research pages share
`click-butterflies.js` / `click-butterflies.css`. The effect reuses the original
playground’s segmented SVG wings with scoped class names. Empty-background clicks
release one small butterfly for roughly three seconds, with a three-butterfly cap.
Controls, text, selections, drags, modified clicks, and reduced motion suppress it.
The decorative elements never intercept input and are removed when hidden or printed.
The standalone butterfly playground keeps its existing behavior.
