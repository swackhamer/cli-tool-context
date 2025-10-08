## Media Processing Tools

### **ffmpeg** - Media Processing Swiss Army Knife
<!-- metadata:
category: Media Processing Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ffmpeg, media processing swiss army kn]
synonyms: [ffmpeg]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Complete cross-platform solution for recording, converting, and streaming audio and video
**Location**: `/opt/homebrew/bin/ffmpeg`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic conversion) / ⭐⭐⭐⭐⭐ Expert (Complex processing)
**Common Use Cases**:

- Video and audio format conversion
- Media compression and optimization
- Stream processing and manipulation
- Video/audio editing and filtering

**See Also**: `imagemagick` (image processing), `sox` (audio processing), `youtube-dl` (media downloading)

**Examples**:

```bash
# Basic format conversion
ffmpeg -i input.mp4 output.avi           # Convert video format
ffmpeg -i input.wav output.mp3           # Convert audio format
ffmpeg -i input.mp4 output.mp3           # Extract audio from video

# Video compression and quality control
ffmpeg -i input.mp4 -crf 23 output.mp4               # Variable bitrate (good quality)
ffmpeg -i input.mp4 -b:v 1M output.mp4               # Fixed bitrate
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4    # Resize video

# Audio processing
ffmpeg -i input.mp3 -ab 128k output.mp3              # Change audio bitrate
ffmpeg -i input.wav -ac 1 output.wav                 # Convert to mono
ffmpeg -i input.mp3 -ar 44100 output.mp3             # Change sample rate

# Video manipulation
ffmpeg -i input.mp4 -ss 00:01:30 -t 00:00:30 output.mp4    # Extract 30-second clip starting at 1:30
ffmpeg -i input.mp4 -vf "crop=640:480:0:0" output.mp4      # Crop video
ffmpeg -i input.mp4 -vf "rotate=90*PI/180" output.mp4      # Rotate 90 degrees

# Concatenation and merging
ffmpeg -f concat -i filelist.txt -c copy output.mp4   # Concatenate videos (filelist.txt contains file paths)
ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac output.mp4  # Add audio track to video

# Streaming and live processing
ffmpeg -f avfoundation -i "0" -vcodec libx264 -f flv rtmp://server/live/stream  # Stream webcam (macOS)
ffmpeg -re -i input.mp4 -f flv rtmp://server/live/stream  # Stream video file

# Advanced filtering
ffmpeg -i input.mp4 -vf "drawtext=text='Watermark':x=10:y=10" output.mp4  # Add text overlay
ffmpeg -i input.mp4 -vf "fps=30" output.mp4                               # Change frame rate
```


### **sox** - Sound Exchange Audio Processor
<!-- metadata:
category: Media Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [sox, sound exchange audio processor]
synonyms: [sox]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Swiss Army knife of sound processing programs, command-line audio manipulation
**Location**: `/opt/homebrew/bin/sox`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic operations) / ⭐⭐⭐⭐ Advanced (Complex effects)
**Common Use Cases**:

- Audio format conversion
- Audio effects and filtering
- Audio analysis and statistics
- Batch audio processing

**See Also**: `ffmpeg` (video/audio conversion), `play` (sox playback), `rec` (sox recording)

**Examples**:

```bash
# Format conversion
sox input.wav output.mp3                    # Convert WAV to MP3
sox input.flac output.wav                   # Convert FLAC to WAV
sox input.mp3 -r 44100 output.wav          # Convert with sample rate

# Audio effects
sox input.wav output.wav vol 0.5            # Reduce volume by half
sox input.wav output.wav reverb             # Add reverb effect
sox input.wav output.wav echo 0.8 0.9 1000 0.3  # Add echo effect
sox input.wav output.wav speed 1.5          # Speed up audio by 50%

# Audio analysis
sox input.wav -n stat                       # Show audio statistics
sox input.wav -n trim 0 10 stat            # Stats for first 10 seconds
soxi input.wav                              # Show file information

# Audio manipulation
sox input.wav output.wav trim 30 60         # Extract 60 seconds starting at 30s
sox input.wav output.wav fade 3 -0 3        # Add 3-second fade in/out
sox input1.wav input2.wav output.wav        # Concatenate audio files
sox input.wav output.wav channels 1         # Convert to mono

# Batch processing
for file in *.wav; do sox "$file" "${file%.wav}.mp3"; done  # Convert all WAV to MP3
```


### **exiftool** - Metadata Reader/Writer
<!-- metadata:
category: Media Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [exiftool, metadata reader/writer]
synonyms: [exiftool]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Platform-independent Perl application for reading, writing and editing meta information
**Location**: `/opt/homebrew/bin/exiftool`
**Difficulty**: ⭐⭐ Beginner (Reading metadata) / ⭐⭐⭐⭐ Advanced (Complex editing)
**Common Use Cases**:

- Image/video metadata analysis
- GPS and camera information extraction
- Bulk metadata editing
- Digital forensics and investigation

**See Also**: `imagemagick` (image processing), `ffmpeg` (media metadata), `file` (basic file info)

**Examples**:

```bash
# Read metadata
exiftool image.jpg                          # Show all metadata
exiftool -s -s -s -Make image.jpg          # Get camera make only
exiftool -GPS* image.jpg                   # Show GPS information
exiftool -CreateDate image.jpg             # Show creation date

# Write/modify metadata
exiftool -Artist="John Doe" image.jpg      # Set artist name
exiftool -Copyright="©2024" *.jpg          # Add copyright to all JPGs
exiftool -GPS*= image.jpg                  # Remove all GPS data
exiftool -overwrite_original -GPS*= *.jpg  # Strip GPS from all images

# Batch operations
exiftool -r -ext jpg -Make .               # Find all JPG files and show camera make
exiftool -csv -r -ext jpg . > metadata.csv # Export metadata to CSV
exiftool -d "%Y-%m-%d %H:%M:%S" -CreateDate -r . # Show creation dates recursively

# Rename files based on metadata
exiftool '-filename<CreateDate' -d "%Y%m%d_%H%M%S%%+c.%%e" *.jpg
# Rename: IMG_1234.jpg → 20240315_143022.jpg

# Advanced metadata manipulation
exiftool -TagsFromFile source.jpg target.jpg    # Copy metadata between files
exiftool -geotag gps_log.gpx *.jpg             # Add GPS coordinates from GPX file
```


### **imagemagick (convert/magick)** - Image Manipulation Suite
<!-- metadata:
category: Media Processing Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [imagemagick (convert/magick), image manipulation suite  ]
synonyms: [imagemagick-(convert/magick)]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Software suite for displaying, converting, and editing raster image and vector image files
**Location**: `/opt/homebrew/bin/convert`, `/opt/homebrew/bin/magick`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic operations) / ⭐⭐⭐⭐⭐ Expert (Complex compositions)
**Common Use Cases**:

- Image format conversion
- Image resizing and manipulation
- Batch image processing
- Image effects and compositing

**See Also**: `exiftool` (metadata handling), `ffmpeg` (video processing), `sips` (macOS image processing)

**Examples**:

```bash
# Format conversion
convert image.png image.jpg                 # PNG to JPG
convert image.tiff image.webp               # TIFF to WebP
magick *.png pdf_output.pdf                # Multiple images to PDF

# Resizing and scaling
convert input.jpg -resize 800x600 output.jpg           # Resize to 800x600
convert input.jpg -resize 50% output.jpg               # Resize to 50% of original
convert input.jpg -thumbnail 200x200 output.jpg        # Create thumbnail

# Image effects and manipulation
convert input.jpg -rotate 90 output.jpg                # Rotate 90 degrees
convert input.jpg -flip output.jpg                     # Flip vertically
convert input.jpg -flop output.jpg                     # Flip horizontally
convert input.jpg -negate output.jpg                   # Invert colors

# Quality and compression
convert input.jpg -quality 80 output.jpg               # Set JPEG quality
convert input.png -strip output.png                    # Remove metadata
convert input.jpg -colorspace Gray output.jpg          # Convert to grayscale

# Batch processing
mogrify -resize 800x600 *.jpg                         # Resize all JPGs in place
mogrify -format png *.jpg                             # Convert all JPGs to PNG
for img in *.jpg; do convert "$img" -resize 400x400 "thumb_$img"; done

# Advanced operations
convert input.jpg -crop 300x300+100+100 output.jpg    # Crop 300x300 starting at (100,100)
convert input.jpg -blur 2x2 output.jpg                # Apply blur
convert -background white -fill black -font Arial -pointsize 72 label:"Hello" text.png
```
```

### **pandoc** - Universal Document Converter
<!-- metadata:
category: Media Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [pandoc, universal document converter]
synonyms: [pandoc]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Universal markup converter supporting numerous document formats
**Location**: `/opt/homebrew/bin/pandoc`
**Difficulty**: ⭐⭐ Beginner (Basic conversion) / ⭐⭐⭐⭐ Advanced (Custom templates)
**Common Use Cases**:

- Convert between document formats (Markdown, HTML, PDF, Word, etc.)
- Generate documentation from markup
- Academic paper preparation
- Static site generation support

**See Also**: `markdown` (Markdown processor), `latex` (LaTeX typesetting), `asciidoc` (text document format)

**Examples**:

```bash
# Basic format conversions
pandoc document.md -o document.html              # Markdown to HTML
pandoc document.md -o document.pdf               # Markdown to PDF
pandoc document.html -o document.docx            # HTML to Word document
pandoc document.docx -o document.md              # Word document to Markdown

# Advanced PDF generation
pandoc document.md -o document.pdf --pdf-engine=xelatex          # Use XeLaTeX engine
pandoc document.md -o document.pdf --toc                         # Include table of contents
pandoc document.md -o document.pdf --template=custom.latex       # Use custom template

# Multiple input files
pandoc chapter1.md chapter2.md chapter3.md -o book.pdf          # Combine multiple files
pandoc *.md -o complete_guide.html                              # Convert all markdown files

# Customization and metadata
pandoc document.md -o document.html --css=styles.css            # Add CSS styling
pandoc document.md -o document.pdf --metadata title="My Title"  # Add metadata
pandoc document.md -o document.html --self-contained            # Embed all assets

# Academic writing
pandoc paper.md -o paper.pdf --bibliography=refs.bib --csl=apa.csl  # With citations
pandoc document.md -o document.html --mathjax                       # Math support for web
pandoc document.md -o document.pdf --number-sections                # Numbered sections

# Presentation generation
pandoc slides.md -o slides.html -t revealjs                     # HTML presentation
pandoc slides.md -o slides.pdf -t beamer                        # PDF slides (LaTeX Beamer)

# Advanced filtering and processing
pandoc document.md -o document.html --filter pandoc-crossref    # Cross-references
pandoc document.md -o document.pdf --lua-filter=custom.lua      # Custom Lua filter
```


### **neovim** - Modern Vim Fork
<!-- metadata:
category: Media Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: [nvim]
tags: [#editor, #vim, #modern-alternative, #lua]
related: [vim, emacs, helix, kakoune]
keywords: [neovim, nvim, vim, editor, lua, lsp, treesitter, modern-vim]
synonyms: [nvim, neo-vim, vim-fork, modern-vim]
platform: [macOS, Linux, Windows]
installation: brew install neovim
-->
**Description**: Hyperextensible Vim-based text editor with Lua scripting and modern features
**Location**: `/opt/homebrew/bin/nvim`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic usage) / ⭐⭐⭐⭐⭐ Expert (Advanced configuration)
**Common Use Cases**:

- Modern code editing with LSP support
- Terminal-based IDE experience
- Remote development
- Lua-based configuration
- Plugin ecosystem integration

**See Also**: `vim` (original), `emacs` (alternative), `helix` (modern modal editor), `kakoune` (selection-oriented editor)

**Examples**:

```bash
# Basic usage
nvim file.txt                # Open file
nvim +10 file.txt           # Open at line 10
nvim -d file1 file2         # Diff mode
nvim -R file.txt            # Read-only mode

# Configuration locations
# ~/.config/nvim/init.vim    # Vimscript config
# ~/.config/nvim/init.lua    # Lua config (preferred)

# Basic Lua configuration example
mkdir -p ~/.config/nvim
cat > ~/.config/nvim/init.lua << 'EOF'
-- Basic settings
vim.opt.number = true         -- Show line numbers
vim.opt.relativenumber = true -- Relative line numbers
vim.opt.expandtab = true      -- Use spaces instead of tabs
vim.opt.shiftwidth = 2        -- Size of indent
vim.opt.smartindent = true    -- Smart indentation

-- Key mappings
vim.g.mapleader = " "         -- Set leader key to space
vim.keymap.set("n", "<leader>w", ":w<CR>")  -- Quick save
vim.keymap.set("n", "<leader>q", ":q<CR>")  -- Quick quit
EOF

# Plugin management with lazy.nvim
git clone --filter=blob:none --branch=stable \
  https://github.com/folke/lazy.nvim.git \
  ~/.local/share/nvim/lazy/lazy.nvim

# Built-in features
nvim --version              # Check version and features
nvim +checkhealth          # Health check for dependencies
nvim +":help"              # Built-in help system

# Terminal mode
# :terminal                 # Open terminal in nvim
# Ctrl+\ Ctrl+n            # Exit terminal mode

# LSP (Language Server Protocol) example
# :LspInfo                 # Show LSP status
# :LspInstall python      # Install Python LSP

# Common commands
# :Telescope find_files   # Fuzzy file finder (with telescope plugin)
# :NvimTreeToggle        # File explorer (with nvim-tree plugin)
# :Mason                 # Package manager (with mason.nvim)
```


### **nano** - Simple Text Editor
<!-- metadata:
category: Media Processing Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [nano, simple text editor]
synonyms: [nano]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Simple, user-friendly text editor
**Location**: `/usr/bin/nano`
**Difficulty**: ⭐ Beginner (Very user-friendly with on-screen help)
**Common Use Cases**:

- Quick file editing
- Configuration changes
- Simple text manipulation

**See Also**: Related tools in this category

**Examples**:

```bash
# Edit file
nano filename

# Ctrl+O: Save
# Ctrl+X: Exit
# Ctrl+W: Search
# Ctrl+K: Cut line
# Ctrl+U: Paste
```

---

