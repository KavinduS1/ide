const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-code'), {
    mode: 'htmlmixed',
    theme: 'material-darker',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
  });
  
  const cssEditor = CodeMirror.fromTextArea(document.getElementById('css-code'), {
    mode: 'css',
    theme: 'material-darker',
    lineNumbers: true,
    autoCloseBrackets: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
  });
  
  const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
    mode: 'javascript',
    theme: 'material-darker',
    lineNumbers: true,
    autoCloseBrackets: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
  });
  
  const previewFrame = document.getElementById('preview-frame').contentWindow.document;
  const toggleBtn = document.getElementById('toggle-btn');
  const clearBtn = document.getElementById('clear-btn');
  const downloadBtn = document.getElementById('download-btn');
  const titleInput = document.getElementById('title-input');
  const editorContainer = document.getElementById('editor-container');
  
  function updatePreview() {
    const title = titleInput.value || 'Untitled';
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const js = `<script>${jsEditor.getValue()}<\/script>`;
    previewFrame.open();
    previewFrame.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${css}
      </head>
      <body>
        ${html}
        ${js}
      </body>
      </html>
    `);
    previewFrame.close();
  }
  
  htmlEditor.on('change', updatePreview);
  cssEditor.on('change', updatePreview);
  jsEditor.on('change', updatePreview);
  titleInput.addEventListener('input', updatePreview);
  
  // Initialize with default content
  htmlEditor.setValue('<h1>Hello, World!</h1>');
  cssEditor.setValue('body { font-family: Arial, sans-serif; }');
  jsEditor.setValue('console.log("Hello from JavaScript!");');
  titleInput.value = 'My Webpage';
  updatePreview();
  
  // Toggle editor visibility
  toggleBtn.addEventListener('click', () => {
    editorContainer.classList.toggle('hide-editors');
    if (editorContainer.classList.contains('hide-editors')) {
      toggleBtn.textContent = 'Show Editors';
    } else {
      toggleBtn.textContent = 'Hide Editors';
    }
  });
  
  // Clear all code
  clearBtn.addEventListener('click', () => {
    htmlEditor.setValue('');
    cssEditor.setValue('');
    jsEditor.setValue('');
    titleInput.value = '';
    updatePreview();
  });
  
  // Download files as ZIP
  downloadBtn.addEventListener('click', () => {
    const zip = new JSZip();
  
    // Add files to the ZIP
    zip.file("index.html", `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titleInput.value || 'Untitled'}</title>
        <style>${cssEditor.getValue()}</style>
      </head>
      <body>
        ${htmlEditor.getValue()}
        <script>${jsEditor.getValue()}<\/script>
      </body>
      </html>
    `);
    zip.file("styles.css", cssEditor.getValue());
    zip.file("script.js", jsEditor.getValue());
  
    // Generate the ZIP file and trigger download
    zip.generateAsync({ type: "blob" })
      .then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${titleInput.value || 'Untitled'}.zip`;
        link.click();
      });
  });