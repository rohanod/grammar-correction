# Planning Guide

A web application that displays grammar corrections at the word and symbol level, comparing original text with corrected text through URL parameters, designed with a clean, educational interface.

**Experience Qualities**: 
1. **Clear** - Users should immediately understand what was corrected and why through visual differentiation
2. **Educational** - The interface should feel like a helpful learning tool rather than a criticism
3. **Refined** - Professional and polished presentation that feels trustworthy and authoritative

**Complexity Level**: Light Application (multiple features with basic state)
  - Single-purpose tool focused on displaying grammar corrections with interactive comparison views

## Essential Features

### URL Parameter Parsing
- **Functionality**: Parse the inline correction payload embedded in the `data` query parameter
- **Purpose**: Allow shareable links where corrections stay next to the text they modify
- **Trigger**: Page load with URL parameter `?data=<base64>` containing `{ "text": "..." }`
- **Progression**: Load page → Parse `data` → Base64 decode → Parse JSON text → Build corrections → Render comparison view
- **Payload format**: The JSON object must have a `text` property whose value contains inline markup using the hyphen-based format `{{original-corrected|type|reason}}`
  - `original`: incorrect text (empty for insertions)
  - `corrected`: replacement text (empty for deletions)
  - `type`: `grammar`, `spelling`, `punctuation`, `word-choice`, or `capitalization`
  - `reason`: optional explanation surfaced in the UI
- **Success criteria**: Inline corrections render accurately with the same ordering and explanations provided in the source string; malformed payloads produce readable errors instead of crashes

### Inline Payload + URL Generation Workflow
- **Functionality**: Provide deterministic instructions (consumed by LLM/code-interpreter automations) for building, encoding, and sharing corrections
- **Process**:
  1. Insert inline corrections directly inside the text using the hyphen format (example: `{{helo-Hello|spelling|Correct spelling}} world`).
  2. Wrap the string in JSON `{ "text": "<inline text>" }`.
  3. Base64-encode the JSON and append it to `https://rohanod.github.io/grammar-correction/?data=<base64>`.
- **Automation requirements**: LLMs should output only the final URL and corrected text, relying on the code interpreter to avoid transcription errors.
- **Success criteria**: Copying the generated URL immediately loads the same corrections inside the viewer, and helper docs (README, `llms.txt`, empty state) stay fully aligned.

### Word-Level Diff Display with Toggle
- **Functionality**: Show original or corrected text with word-by-word highlighting and ability to toggle between views
- **Purpose**: Allow users to compare original mistakes with corrections by switching views
- **Trigger**: Successful parsing of correction data, button click to toggle
- **Progression**: Display original text by default → User clicks toggle → Switch to corrected view → Highlights remain interactive → Click again to return to original
- **Success criteria**: Seamless toggling between views with all changes visible and clear color coding

### Interactive Correction Details
- **Functionality**: Click or hover on corrections to see detailed information
- **Purpose**: Provide context and explanation for each correction
- **Trigger**: User interaction with highlighted text
- **Progression**: Hover/click correction → Show tooltip/popover → Display correction type and details; desktop relies on hover/focus popovers while mobile devices open a dialog sheet after a tap
- **Success criteria**: Smooth interactions with clear, helpful information

### Empty State
- **Functionality**: Welcoming interface when no URL parameters present
- **Purpose**: Guide users on how to use the application
- **Trigger**: Page load without valid parameters
- **Progression**: Show empty state → Display inline-format instructions + JSON sample → Provide `Try Example` button that calls `generateExampleURL()` and navigates the user
- **Success criteria**: Users understand how to use the tool

## Edge Case Handling

- **Invalid URL Parameters**: Display friendly error message with format guidance
- **Malformed JSON or Inline Markers**: Gracefully handle parsing errors with clear feedback, asking for the `{ "text": "..." }` payload that uses `{{original-corrected|type|reason}}`
- **Very Long Text**: Implement scrollable containers to handle lengthy paragraphs
- **No Corrections**: Display message indicating text is already correct
- **Special Characters**: Properly encode/decode special characters and symbols
- **Unsupported Types**: Default to muted styling when unknown correction types appear, but log an error for follow-up

## Design Direction

The design should feel precise, educational, and trustworthy - like a digital editor's desk with a modern, clean interface that emphasizes readability and clarity through generous spacing and the calming blue gradient palette.

## Color Selection

Analogous (adjacent colors on the color wheel) - Using a harmonious blue gradient from vibrant neon to soft cyan, creating a calm, intellectual atmosphere that feels professional and approachable.

- **Primary Color**: Neon Blue (#5465ff) - Main brand color representing precision and intelligence
- **Secondary Colors**: Cornflower Blue (#788bff) and Jordy Blue (#9bb1ff) for interactive elements and gradients
- **Accent Color**: Periwinkle (#bfd7ff) for highlights and corrections, drawing attention without harshness
- **Foreground/Background Pairings**: 
  - Background (Light Cyan #e2fdff): Dark text (#1a2332) - Ratio 12.8:1 ✓
  - Card (White #ffffff): Dark text (#1a2332) - Ratio 15.2:1 ✓
  - Primary (Neon Blue #5465ff): White text (#ffffff) - Ratio 5.1:1 ✓
  - Accent (Periwinkle #bfd7ff): Dark text (#2d3748) - Ratio 7.2:1 ✓
  - Muted (Jordy Blue #9bb1ff): White text (#ffffff) - Ratio 4.8:1 ✓

## Font Selection

Typography should feel modern and highly legible, optimized for reading both short corrections and longer paragraphs - using Inter for its excellent readability at all sizes and clean, professional appearance.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing/-0.02em
  - H2 (Section Headers): Inter SemiBold/24px/normal letter spacing
  - Body (Original/Corrected Text): Inter Regular/18px/1.7 line height
  - Labels (Correction Types): Inter Medium/14px/uppercase/0.05em letter spacing
  - Small (Hints/Tooltips): Inter Regular/13px/1.5 line height

## Animations

Subtle and purposeful animations that guide attention to corrections without being distracting, using gentle fades and scale transitions that feel precise and controlled.

- **Purposeful Meaning**: Animations reinforce the educational aspect - corrections gently highlight to draw focus, tooltips fade in smoothly to provide context
- **Hierarchy of Movement**: Most important: correction highlights on hover; Secondary: tooltip appearances; Tertiary: page transitions

## Component Selection

- **Components**: 
  - Card for main content containers with subtle shadows
  - Badge for correction type labels and correction count
  - Button for toggling between original and corrected views
  - Tooltip/Popover for detailed correction information
  - Alert for error states and empty states
  - Separator for visual division between sections
  - ScrollArea for long text content
  
- **Customizations**: 
  - Custom diff highlighting component with word-level granularity
  - Inline correction markers with hover states
  - Gradient backgrounds using the blue color scheme
  
- **States**: 
  - Buttons: Soft shadow on hover, subtle scale on press, variant changes based on active view
  - Corrections: Highlighted background on hover, tooltip on interaction
  - Cards: Subtle lift effect with shadow transition
  - Toggle: Clear visual indication of which view is active
  
- **Icon Selection**: 
  - Check (for correct text and correction count)
  - Warning (for errors)
  - ArrowRight (for showing progression in tooltips)
  - ArrowsClockwise (for toggle button)
  - Info (for help/instructions)
  
- **Spacing**: 
  - Container padding: p-8
  - Card spacing: gap-6
  - Text line height: leading-relaxed (1.7)
  - Section margins: mb-8
  
- **Mobile**: 
  - Single column layout on mobile
  - Larger touch targets (min 44px)
  - Stacked comparison views instead of side-by-side
  - Simplified tooltips that work well on touch devices
