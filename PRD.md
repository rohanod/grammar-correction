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
- **Functionality**: Parse URL parameter containing base64-encoded correction data
- **Purpose**: Allow shareable links with embedded correction information using a clean, simple format
- **Trigger**: Page load with URL parameter `?data=<base64>` (legacy format `?original=text&corrections=data` also supported)
- **Progression**: Load page → Parse URL params → Base64 decode data → Parse JSON → Render comparison view
- **Success criteria**: Correctly handles encoded data and displays all corrections accurately with backwards compatibility

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
- **Progression**: Hover/click correction → Show tooltip/popover → Display correction type and details
- **Success criteria**: Smooth interactions with clear, helpful information

### Empty State
- **Functionality**: Welcoming interface when no URL parameters present
- **Purpose**: Guide users on how to use the application
- **Trigger**: Page load without valid parameters
- **Progression**: Show empty state → Display usage instructions → Provide example link
- **Success criteria**: Users understand how to use the tool

## Edge Case Handling

- **Invalid URL Parameters**: Display friendly error message with format guidance
- **Malformed JSON**: Gracefully handle parsing errors with clear feedback
- **Very Long Text**: Implement scrollable containers to handle lengthy paragraphs
- **No Corrections**: Display message indicating text is already correct
- **Special Characters**: Properly encode/decode special characters and symbols

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
