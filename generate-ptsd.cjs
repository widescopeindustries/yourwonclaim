const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

const pdfStyle = `
body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #333; padding: 20px; }
h1 { color: #1a365d; text-align: center; text-transform: uppercase; font-size: 24pt; margin-bottom: 5px; border-bottom: 3px solid #2563EB; padding-bottom: 10px; }
h2 { color: #2563EB; text-align: center; font-size: 16pt; margin-top: 0; margin-bottom: 30px; font-style: italic; }
h3 { color: #1a365d; font-size: 14pt; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; }
blockquote { background: #f0f9ff; border-left: 5px solid #2563EB; margin: 20px 0; padding: 15px; color: #1e40af; font-weight: bold; font-size: 12pt; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th { background-color: #1e40af; color: white; padding: 10px; text-align: left; font-size: 10pt; }
td { border: 1px solid #e2e8f0; padding: 10px; font-size: 10pt; vertical-align: top; }
tr:nth-child(even) { background-color: #f8fafc; }
`;

(async () => {
  const mdPath = path.join(__dirname, 'product/templates/PTSD_Evidence_Log_Template.md');
  const outPath = path.join(__dirname, 'product/pdfs/PTSD_Evidence_Log_Template.pdf');
  
  const pdf = await mdToPdf({ path: mdPath }, { 
    stylesheet: [],
    css: pdfStyle,
    pdf_options: { format: 'Letter', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } }
  });
  
  if (pdf) {
    fs.writeFileSync(outPath, pdf.content);
    console.log('Generated: ' + outPath + ' (' + pdf.content.length + ' bytes)');
    
    const copies = [
      'product/templates/PTSD_Evidence_Log_Template.pdf',
      'dist/product/pdfs/PTSD_Evidence_Log_Template.pdf',
      'dist/product/templates/PTSD_Evidence_Log_Template.pdf',
      'ptsd-log-recreated/PTSD_Evidence_Log_Template.pdf'
    ];
    for (const c of copies) {
      const dest = path.join(__dirname, c);
      if (fs.existsSync(path.dirname(dest))) {
        fs.writeFileSync(dest, pdf.content);
        console.log('Copied to: ' + c);
      }
    }
  }
})();
