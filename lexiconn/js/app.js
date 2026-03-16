/* ============================================
   LexiConn — Core Application Logic
   Enhanced with advanced realism features
   ============================================ */

(function () {
  'use strict';

  // ─── DOM REFERENCES ───
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const uploadScreen = $('#upload-screen');
  const editorScreen = $('#editor-screen');
  const uploadZone = $('#upload-zone');
  const pageFileInput = $('#page-file-input');
  const pageBgImg = $('#page-bg-img');
  const textOverlay = $('#text-overlay');
  const headerFields = $('#header-fields');
  const pagePreview = $('#page-preview');
  const controlPanel = $('#control-panel');

  // Controls
  const fontSelect = $('#font-select');
  const fontFileUpload = $('#font-file-upload');
  const fontSizeSlider = $('#font-size');
  const inkColorPicker = $('#ink-color');
  const lineHeightSlider = $('#line-height');
  const letterSpacingSlider = $('#letter-spacing');
  const wordSpacingSlider = $('#word-spacing');
  const marginTopSlider = $('#margin-top');
  const marginLeftSlider = $('#margin-left');
  const marginRightSlider = $('#margin-right');
  const headerTopSlider = $('#header-top');
  const headerFontSizeSlider = $('#header-font-size');
  const toggleHeader = $('#toggle-header');
  const toggleWobble = $('#toggle-wobble');
  const wobbleAmountSlider = $('#wobble-amount');
  const toggleOpacityVar = $('#toggle-opacity-var');
  const exportQuality = $('#export-quality');

  // New realism controls
  const toggleBaselineShift = $('#toggle-baseline-shift');
  const baselineAmountSlider = $('#baseline-amount');
  const toggleSizeVar = $('#toggle-size-var');
  const toggleInkBleed = $('#toggle-ink-bleed');
  const toggleSlantVar = $('#toggle-slant-var');

  // Buttons
  const btnChangePage = $('#btn-change-page');
  const btnDownloadPng = $('#btn-download-png');
  const btnDownloadPdf = $('#btn-download-pdf');
  const btnTogglePanel = $('#btn-toggle-panel');
  const darkModeToggle = $('#dark-mode-toggle');

  // ─── STATE ───
  let currentFont = "PatrickHand";
  let wobbleEnabled = true;
  let wobbleAmount = 0.8;
  let opacityVarEnabled = false;
  let baselineShiftEnabled = true;
  let baselineAmount = 1.5;
  let sizeVarEnabled = true;
  let inkBleedEnabled = true;
  let slantVarEnabled = false;

  // ─── DARK MODE ───
  if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        localStorage.setItem('lexiconn-theme',
          document.body.classList.contains('light') ? 'light' : 'dark');
      });
      if (localStorage.getItem('lexiconn-theme') === 'light') {
        document.body.classList.add('light');
      }
  }

  // ─── PANEL TOGGLE ───
  if (btnTogglePanel) {
      btnTogglePanel.addEventListener('click', () => {
        controlPanel.classList.toggle('collapsed');
      });
  }

  // ─── FILE UPLOAD ───
  function handlePageUpload(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      pageBgImg.src = e.target.result;
      pageBgImg.onload = () => {
        uploadScreen.classList.add('hidden');
        editorScreen.classList.remove('hidden');
        textOverlay.focus();
      };
    };
    reader.readAsDataURL(file);
  }

  if (uploadZone) {
      uploadZone.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        pageFileInput.click();
      });
      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
      });
      uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
      });
      uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handlePageUpload(file);
      });
  }

  if (pageFileInput) {
      pageFileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handlePageUpload(e.target.files[0]);
      });
  }

  if (btnChangePage) {
      btnChangePage.addEventListener('click', () => {
        pageFileInput.click();
      });
  }


  // ─── FONT SELECTION ───
  if (fontSelect) {
      fontSelect.addEventListener('change', (e) => {
        currentFont = e.target.value;
        applyFont();
      });
  }

  function applyFont() {
    textOverlay.style.fontFamily = currentFont;
    $$('.header-field').forEach(f => f.style.fontFamily = currentFont);
  }

  // Custom font upload
  if (fontFileUpload) {
      fontFileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const fontFace = new FontFace('CustomUpload', ev.target.result);
          fontFace.load().then((loaded) => {
            document.fonts.add(loaded);
            currentFont = 'CustomUpload';
            applyFont();
            const option = document.createElement('option');
            option.value = 'CustomUpload';
            option.textContent = '✨ ' + file.name;
            option.selected = true;
            fontSelect.appendChild(option);
          }).catch(() => {
            alert('Failed to load font file. Please try a different .ttf or .otf file.');
          });
        };
        reader.readAsArrayBuffer(file);
      });
  }

  // ─── FONT SIZE ───
  if (fontSizeSlider) {
      fontSizeSlider.addEventListener('input', (e) => {
        const v = e.target.value;
        textOverlay.style.fontSize = v + 'px';
        $('#font-size-val').textContent = v + 'px';
      });
  }

  // ─── INK COLOR ───
  function setInkColor(color) {
    textOverlay.style.color = color;
    $$('.header-field').forEach(f => f.style.color = color);
  }

  if (inkColorPicker) {
      inkColorPicker.addEventListener('input', (e) => {
        setInkColor(e.target.value);
      });
  }

  $$('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      inkColorPicker.value = color;
      setInkColor(color);
    });
  });

  // ─── LINE HEIGHT ───
  if (lineHeightSlider) {
      lineHeightSlider.addEventListener('input', (e) => {
        textOverlay.style.lineHeight = e.target.value;
        $('#line-height-val').textContent = parseFloat(e.target.value).toFixed(1);
      });
  }

  // ─── LETTER SPACING ───
  if (letterSpacingSlider) {
      letterSpacingSlider.addEventListener('input', (e) => {
        textOverlay.style.letterSpacing = e.target.value + 'px';
        $('#letter-spacing-val').textContent = e.target.value + 'px';
      });
  }

  // ─── WORD SPACING ───
  if (wordSpacingSlider) {
      wordSpacingSlider.addEventListener('input', (e) => {
        textOverlay.style.wordSpacing = e.target.value + 'px';
        $('#word-spacing-val').textContent = e.target.value + 'px';
      });
  }

  // ─── MARGINS ───
  if (marginTopSlider) {
      marginTopSlider.addEventListener('input', (e) => {
        textOverlay.style.top = e.target.value + 'px';
        $('#margin-top-val').textContent = e.target.value + 'px';
      });
      marginLeftSlider.addEventListener('input', (e) => {
        textOverlay.style.left = e.target.value + 'px';
        $('#margin-left-val').textContent = e.target.value + 'px';
      });
      marginRightSlider.addEventListener('input', (e) => {
        textOverlay.style.right = e.target.value + 'px';
        $('#margin-right-val').textContent = e.target.value + 'px';
      });
  }

  // ─── HEADER FIELDS ───
  if (toggleHeader) {
      toggleHeader.addEventListener('change', () => {
        headerFields.style.display = toggleHeader.checked ? 'flex' : 'none';
      });
      headerTopSlider.addEventListener('input', (e) => {
        headerFields.style.top = e.target.value + 'px';
        $('#header-top-val').textContent = e.target.value + 'px';
      });
      headerFontSizeSlider.addEventListener('input', (e) => {
        $$('.header-field').forEach(f => f.style.fontSize = e.target.value + 'px');
        $('#header-font-size-val').textContent = e.target.value + 'px';
      });
  }

  // ─── REALISM CONTROLS ───
  if (toggleWobble) {
      toggleWobble.addEventListener('change', () => {
        wobbleEnabled = toggleWobble.checked;
      });
      wobbleAmountSlider.addEventListener('input', (e) => {
        wobbleAmount = parseFloat(e.target.value);
        $('#wobble-amount-val').textContent = wobbleAmount.toFixed(1) + '°';
      });
      toggleOpacityVar.addEventListener('change', () => {
        opacityVarEnabled = toggleOpacityVar.checked;
      });
  }

  // New realism controls (safe — check if elements exist)
  if (toggleBaselineShift) {
    toggleBaselineShift.addEventListener('change', () => {
      baselineShiftEnabled = toggleBaselineShift.checked;
    });
  }
  if (baselineAmountSlider) {
    baselineAmountSlider.addEventListener('input', (e) => {
      baselineAmount = parseFloat(e.target.value);
      $('#baseline-amount-val').textContent = baselineAmount.toFixed(1) + 'px';
    });
  }
  if (toggleSizeVar) {
    toggleSizeVar.addEventListener('change', () => {
      sizeVarEnabled = toggleSizeVar.checked;
    });
  }
  if (toggleInkBleed) {
    toggleInkBleed.addEventListener('change', () => {
      inkBleedEnabled = toggleInkBleed.checked;
    });
  }
  if (toggleSlantVar) {
    toggleSlantVar.addEventListener('change', () => {
      slantVarEnabled = toggleSlantVar.checked;
    });
  }

  // ─── PASTE HANDLER (plain text only) ───
  if (textOverlay) {
      textOverlay.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
      });
  }

  // ─── ADVANCED REALISM ENGINE ───
  // Processes text at CHARACTER level for maximum realism

  function applyRealismEffects() {
    const anyEnabled = wobbleEnabled || opacityVarEnabled ||
      baselineShiftEnabled || sizeVarEnabled || slantVarEnabled || inkBleedEnabled;
    if (!anyEnabled) return false;

    // Apply ink bleed via CSS text-shadow
    if (inkBleedEnabled && inkColorPicker) {
      const color = inkColorPicker.value;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const bleed = `0 0 0.4px rgba(${r},${g},${b},0.3), 0 0 0.8px rgba(${r},${g},${b},0.15)`;
      textOverlay.style.textShadow = bleed;
      $$('.header-field').forEach(f => f.style.textShadow = bleed);
    }

    // Process each editable element (text overlay + header fields)
    const elements = [textOverlay, ...$$('.header-field')];

    elements.forEach(el => {
      // Save original
      el.dataset.originalContent = el.innerHTML;

      // Get all text nodes
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      textNodes.forEach(node => {
        // Split into individual characters (keeping spaces)
        const chars = node.textContent.split('');
        if (chars.length === 0) return;

        const fragment = document.createDocumentFragment();
        let inWord = false;

        chars.forEach((char, i) => {
          if (/\s/.test(char)) {
            // Whitespace — just add as text node
            fragment.appendChild(document.createTextNode(char));
            inWord = false;
          } else {
            // Visible character — wrap in span with effects
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';

            let transforms = [];

            // 1. Wobble (rotation)
            if (wobbleEnabled) {
              const angle = (Math.random() - 0.5) * 2 * wobbleAmount;
              transforms.push(`rotate(${angle.toFixed(2)}deg)`);
            }

            // 2. Baseline shift (translateY)
            if (baselineShiftEnabled) {
              const shift = (Math.random() - 0.5) * 2 * baselineAmount;
              transforms.push(`translateY(${shift.toFixed(2)}px)`);
            }

            // 3. Slant variation (skewX)
            if (slantVarEnabled) {
              const skew = (Math.random() - 0.5) * 4; // ±2 degrees
              transforms.push(`skewX(${skew.toFixed(2)}deg)`);
            }

            if (transforms.length > 0) {
              span.style.transform = transforms.join(' ');
            }

            // 4. Opacity variation (ink pressure)
            if (opacityVarEnabled) {
              const opacity = 0.7 + Math.random() * 0.3;
              span.style.opacity = opacity.toFixed(2);
            }

            // 5. Size variation
            if (sizeVarEnabled) {
              const scaleFactor = 0.96 + Math.random() * 0.08; // 0.96 to 1.04
              span.style.fontSize = (scaleFactor * 100).toFixed(1) + '%';
            }

            fragment.appendChild(span);
            inWord = true;
          }
        });

        node.parentNode.replaceChild(fragment, node);
      });
    });

    return true;
  }

  function removeRealismEffects() {
    const elements = [textOverlay, ...$$('.header-field')];
    elements.forEach(el => {
      if (el.dataset.originalContent !== undefined) {
        el.innerHTML = el.dataset.originalContent;
        delete el.dataset.originalContent;
      }
      el.style.textShadow = '';
    });
  }

  // ─── EXPORT: PNG ───
  if (btnDownloadPng) {
      btnDownloadPng.addEventListener('click', async () => {
        await exportAsImage('png');
      });

      // ─── EXPORT: PDF ───
      btnDownloadPdf.addEventListener('click', async () => {
        await exportAsImage('pdf');
      });
  }

  async function exportAsImage(format) {
    const quality = exportQuality ? parseInt(exportQuality.value) : 2;

    // Remove contenteditable carets
    textOverlay.blur();
    $$('.header-field').forEach(f => f.blur());

    // Apply realism effects
    const applied = applyRealismEffects();

    // Brief delay for render
    await new Promise(r => setTimeout(r, 200));

    try {
      const canvas = await html2canvas(pagePreview, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = 'lexiconn-handwriting.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = 210;
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        const pdf = new jsPDF({
          orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('lexiconn-handwriting.pdf');
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    }

    // Restore original content
    if (applied) {
      removeRealismEffects();
    }
  }

  // ─── FONT GENERATOR TOOL ───
  // Generates a printable template, extracts characters from scanned template,
  // and compiles them into a .ttf font using opentype.js

  const CHARSET = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    digits: '0123456789',
    punctuation: '.,!?;:\'"()-/&@#%+=<>[]{}|~`$^*_\\'
  };

  const ALL_CHARS = CHARSET.uppercase + CHARSET.lowercase + CHARSET.digits + CHARSET.punctuation;

  // Font Generator Modal handlers
  const fontGenModal = $('#font-gen-modal');
  const btnOpenFontGen = $('#btn-open-font-gen');
  const btnCloseFontGen = $('#btn-close-font-gen');
  const btnPrintTemplate = $('#btn-print-template');
  const btnScanUpload = $('#scan-upload');
  const templateCanvas = $('#template-canvas');
  const fontGenStatus = $('#font-gen-status');

  if (btnOpenFontGen) {
    btnOpenFontGen.addEventListener('click', () => {
      fontGenModal.classList.remove('hidden');
      generateTemplate();
    });
  }
  if (btnCloseFontGen) {
    btnCloseFontGen.addEventListener('click', () => {
      fontGenModal.classList.add('hidden');
    });
  }

  // Generate printable template
  function generateTemplate() {
    if (!templateCanvas) return;
    const canvas = templateCanvas;
    const ctx = canvas.getContext('2d');

    const cols = 13;
    const cellSize = 60;
    const rows = Math.ceil(ALL_CHARS.length / cols);
    const headerH = 60;
    const padding = 20;

    canvas.width = padding * 2 + cols * cellSize;
    canvas.height = padding + headerH + rows * cellSize + padding;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Inter, Arial, sans-serif';
    ctx.fillText('LexiConn — Handwriting Template', padding, padding + 22);
    ctx.font = '11px Inter, Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('Write each character clearly in its box. Use a dark pen.', padding, padding + 42);

    // Draw grid
    for (let i = 0; i < ALL_CHARS.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * cellSize;
      const y = padding + headerH + row * cellSize;

      // Cell border
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);

      // Character label (small, top-left corner)
      ctx.fillStyle = '#999';
      ctx.font = '10px monospace';
      ctx.fillText(ALL_CHARS[i], x + 3, y + 12);

      // Baseline guide (dotted line at 75% height)
      ctx.strokeStyle = '#e0e0e0';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(x + 5, y + cellSize * 0.75);
      ctx.lineTo(x + cellSize - 5, y + cellSize * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Corner markers for alignment (4 corners of the grid)
    const gridX = padding;
    const gridY = padding + headerH;
    const gridW = cols * cellSize;
    const gridH = rows * cellSize;
    drawCornerMarker(ctx, gridX, gridY);
    drawCornerMarker(ctx, gridX + gridW, gridY);
    drawCornerMarker(ctx, gridX, gridY + gridH);
    drawCornerMarker(ctx, gridX + gridW, gridY + gridH);
  }

  function drawCornerMarker(ctx, x, y) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    // Cross
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10);
    ctx.stroke();
  }

  // Print template
  if (btnPrintTemplate) {
    btnPrintTemplate.addEventListener('click', () => {
      if (!templateCanvas) return;
      const dataUrl = templateCanvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html><head><title>LexiConn Template</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; }
          img { max-width: 100%; height: auto; }
          @media print { body { margin: 0; } img { width: 100%; } }
        </style></head><body>
        <img src="` + dataUrl + `" onload="window.print();" />
        </body></html>
      `);
    });
  }

  // Process scanned template
  if (btnScanUpload) {
    btnScanUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      processScannedTemplate(file);
    });
  }

  async function processScannedTemplate(file) {
    if (fontGenStatus) fontGenStatus.textContent = 'Processing scan...';

    const img = new Image();
    img.onload = async () => {
      try {
        const chars = extractCharacters(img);
        if (fontGenStatus) fontGenStatus.textContent = `Extracted ${chars.length} characters. Building font...`;

        // Build the font using opentype.js
        await buildFont(chars);

        if (fontGenStatus) fontGenStatus.textContent = '✅ Font generated! It has been loaded and selected.';
      } catch (err) {
        console.error('Font generation failed:', err);
        if (fontGenStatus) fontGenStatus.textContent = '❌ Error: ' + err.message;
      }
    };
    img.src = URL.createObjectURL(file);
  }

  function extractCharacters(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Find the corner markers to determine grid bounds
    // For now, use proportion-based extraction (assumes clean scan aligned with template)
    const cols = 13;
    const rows = Math.ceil(ALL_CHARS.length / cols);
    const padding = 20;
    const headerH = 60;
    const cellSize = 60;

    // Scale factors based on actual image size vs template size
    const templateW = padding * 2 + cols * cellSize;
    const templateH = padding + headerH + rows * cellSize + padding;
    const scaleX = img.width / templateW;
    const scaleY = img.height / templateH;

    const characters = [];

    for (let i = 0; i < ALL_CHARS.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Character cell bounds (with margin to exclude label and borders)
      const x = Math.round((padding + col * cellSize + 5) * scaleX);
      const y = Math.round((padding + headerH + row * cellSize + 15) * scaleY);
      const w = Math.round((cellSize - 10) * scaleX);
      const h = Math.round((cellSize - 18) * scaleY);

      // Extract the cell image data
      const cellData = ctx.getImageData(x, y, w, h);

      // Convert to binary (thresholded) — black strokes on white background
      const binaryCanvas = document.createElement('canvas');
      binaryCanvas.width = w;
      binaryCanvas.height = h;
      const bCtx = binaryCanvas.getContext('2d');
      const bData = bCtx.createImageData(w, h);

      for (let p = 0; p < cellData.data.length; p += 4) {
        const gray = cellData.data[p] * 0.299 + cellData.data[p + 1] * 0.587 + cellData.data[p + 2] * 0.114;
        const val = gray < 128 ? 0 : 255;
        bData.data[p] = val;
        bData.data[p + 1] = val;
        bData.data[p + 2] = val;
        bData.data[p + 3] = 255;
      }
      bCtx.putImageData(bData, 0, 0);

      characters.push({
        char: ALL_CHARS[i],
        charCode: ALL_CHARS.charCodeAt(i),
        canvas: binaryCanvas,
        width: w,
        height: h
      });
    }

    return characters;
  }

  async function buildFont(characters) {
    // Check if opentype.js is loaded
    if (typeof opentype === 'undefined') {
      throw new Error('opentype.js not loaded. Please ensure the library is included.');
    }

    const unitsPerEm = 1000;
    const ascender = 800;
    const descender = -200;

    const notdefGlyph = new opentype.Glyph({
      name: '.notdef',
      unicode: 0,
      advanceWidth: 500,
      path: new opentype.Path()
    });

    const glyphs = [notdefGlyph];

    characters.forEach(charInfo => {
      const path = traceCharacterToPath(charInfo.canvas, charInfo.width, charInfo.height, unitsPerEm, ascender);
      const glyph = new opentype.Glyph({
        name: charInfo.char,
        unicode: charInfo.charCode,
        advanceWidth: Math.round((charInfo.width / charInfo.height) * unitsPerEm * 0.8),
        path: path
      });
      glyphs.push(glyph);
    });

    const font = new opentype.Font({
      familyName: 'LexiConnCustom',
      styleName: 'Regular',
      unitsPerEm: unitsPerEm,
      ascender: ascender,
      descender: descender,
      glyphs: glyphs
    });

    // Convert to ArrayBuffer and load
    const buffer = font.toArrayBuffer();
    const fontFace = new FontFace('LexiConnCustom', buffer);
    const loaded = await fontFace.load();
    document.fonts.add(loaded);

    // Select in the dropdown
    currentFont = 'LexiConnCustom';
    applyFont();

    const option = document.createElement('option');
    option.value = 'LexiConnCustom';
    option.textContent = '✨ Your Handwriting';
    option.selected = true;
    fontSelect.appendChild(option);

    // Also offer download of the .ttf
    const blob = new Blob([buffer], { type: 'font/ttf' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'my-handwriting.ttf';
    downloadLink.click();
  }

  // Simple character tracer — converts bitmap to opentype.js Path
  // Uses contour tracing algorithm to extract outline paths
  function traceCharacterToPath(canvas, w, h, unitsPerEm, ascender) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = imageData.data;
    const path = new opentype.Path();

    // Scale factors: map pixel coords to font units
    const scaleX = (unitsPerEm * 0.7) / w;
    const scaleY = unitsPerEm / h;

    // Find bounding box of ink pixels
    let minX = w, minY = h, maxX = 0, maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (pixels[idx] === 0) { // black pixel = ink
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (maxX <= minX || maxY <= minY) {
      // Empty glyph
      return path;
    }

    // Simplified approach: create a series of small rectangles for each ink pixel cluster
    // (A proper implementation would use marching squares or potrace)
    // For now, we sample the bitmap at a lower resolution and create polygon outlines
    const sampleStep = Math.max(1, Math.floor(Math.min(w, h) / 50));

    for (let y = minY; y <= maxY; y += sampleStep) {
      let inInk = false;
      let startX = 0;

      for (let x = minX; x <= maxX + sampleStep; x += sampleStep) {
        const isInk = isPixelInk(pixels, x, y, w, h);

        if (isInk && !inInk) {
          startX = x;
          inInk = true;
        } else if (!isInk && inInk) {
          // Draw a small rectangle for this ink run
          const fx1 = (startX - minX) * scaleX + 50; // offset from left
          const fy1 = ascender - (y - minY) * scaleY;
          const fx2 = (x - minX) * scaleX + 50;
          const fy2 = ascender - (y + sampleStep - minY) * scaleY;

          path.moveTo(fx1, fy1);
          path.lineTo(fx2, fy1);
          path.lineTo(fx2, fy2);
          path.lineTo(fx1, fy2);
          path.close();

          inInk = false;
        }
      }
    }

    return path;
  }

  function isPixelInk(pixels, x, y, w, h) {
    if (x < 0 || x >= w || y < 0 || y >= h) return false;
    const idx = (y * w + x) * 4;
    return pixels[idx] === 0; // black = ink
  }

  // ─── INITIAL FONT LOAD ───
  if (textOverlay) applyFont();

})();
