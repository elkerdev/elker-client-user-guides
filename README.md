# Elker Scribe Guides

This folder contains styled Scribe guides for the Elker platform.

## How to Use

### Method 1: Using the Template (Recommended)
1. Export your guide from Scribe as HTML
2. Open `scribe-template.html` 
3. Paste your Scribe HTML export between the comment markers
4. Save the file with a descriptive name (e.g., `my-guide.html`)

### Method 2: Direct Styling
1. Export your guide from Scribe as HTML
2. Add this line to the top of your HTML file:
   ```html
   <link rel="stylesheet" href="styles.css">
   ```
3. Wrap your content in a container div:
   ```html
   <div class="container-narrow">
       <div class="scribe-container">
           <!-- Your Scribe content here -->
       </div>
   </div>
   ```

## Files

- `styles.css` - Shared stylesheet that applies Elker branding
- `index.html` - Landing page that links to all guides
- `scribe-template.html` - Template file for new guides
- `creating-a-report-from-your-partner-dashboard.html` - Example guide

## Design System

The styling matches the Elker Resource microsite with:
- Cream background (#f9f8f6)
- Teal primary color (#2c6971)
- Elegant serif headings (Lora font)
- Clean sans-serif body text (Inter font)
- Card-based layout with visual grouping of steps and screenshots

## Adding New Guides

1. Export your guide from Scribe
2. Use one of the methods above to apply styling
3. Add a link to your guide in `index.html`