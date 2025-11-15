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

Provide correction data through a single `?data=<base64-encoded-json>` query parameter. The JSON must use the inline format so each correction stays close to the text it modifies:

```
{
  "text": "Text with {{original->corrected|type|reason}} inline corrections"
}
```

Each inline correction follows `{{original->corrected|type|reason}}` where:

- `original`: the mistake (empty for insertions)
- `corrected`: the fix (empty for deletions)
- `type`: one of `grammar`, `spelling`, `punctuation`, `word-choice`, `capitalization`
- `reason`: (optional) explanation for the correction

Example inline string:

```
{{helo->Hello|spelling|Correct spelling}} world! This {{are->is|grammar|Subject-verb agreement}} {{a->an|grammar|Article before a vowel}} example {{grammer->grammar|spelling}} corrections{{->.|punctuation|Add period}}
```

Encode the JSON payload (including the `text` property) with base64 and append it to `?data=`.

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
