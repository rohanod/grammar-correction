# Grammar Correction Viewer

A web application that displays grammar corrections at the word and symbol level, comparing original text with corrected text through URL parameters, designed with a clean, educational interface.

## Features

- **URL Parameter Parsing**: Share corrections via URL with base64-encoded data
- **Word-Level Diff Display**: Toggle between original and corrected text with highlighting
- **Interactive Corrections**: Hover over corrections to see detailed information
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

The application accepts correction data via URL parameters:

```
?data=<base64-encoded-json>
```

The JSON structure should contain:
- `original`: The original text
- `corrected`: The corrected text
- `corrections`: Array of correction objects with details

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Framer Motion

## Deployment

This application can be deployed to any static hosting service that supports single-page applications:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- And more...

Simply build the project and deploy the `dist` folder.
