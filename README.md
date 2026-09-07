# Chess Archived website demo

A self-contained static demo for Chess Archived, built from the existing Offline Chess project materials and the CA-001 Game of the Century production work.

## What is included

- Brand-led, responsive one-page website
- Interactive twelve-ply move-sleeve excerpt
- Optional browser narration for each revealed move
- Six-edition spoiler architecture
- Full-size Chess Archived physical-system concept plate
- Keyboard, screen-reader, reduced-motion, and mobile accommodations
- No framework, package install, build step, account, or backend

The deployable website lives in `dist/`.

## Test locally

Serve the `dist` folder with any static file server. Opening `dist/index.html` directly also works, though a local server is closer to the deployed behavior.

## GitHub Pages

The included workflow publishes the contents of `dist/` whenever the `main` branch is updated.

1. Create a GitHub repository and upload this project at the repository root.
2. In the repository settings, open **Pages** and select **GitHub Actions** as the source.
3. Push to `main` or run the workflow manually.
4. Add the final domain in the Pages settings only after the preview has been approved.

For GoDaddy DNS, use the exact custom-domain records GitHub displays for the repository. Add a `CNAME` file to `dist/` after the final hostname is known.

## Before a public launch

The current demo intentionally asks search engines not to index it. For launch:

- remove the `noindex, nofollow` meta tag from `dist/index.html`;
- replace or remove `dist/robots.txt`;
- add the final domain as `dist/CNAME` if GitHub Pages remains the host;
- replace browser-generated narration with the produced Chess Archived audio when approved;
- decide whether the listener-testing status should remain public.

## Asset note

`dist/assets/chess-archived-system.png` is the supplied Chess Archived concept image. Keep it with the project when uploading or deploying.
