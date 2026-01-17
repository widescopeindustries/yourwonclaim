const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('md-to-pdf');

const templatesDir = path.join(__dirname, '../product/templates');
const outputDir = path.join(__dirname, '../product/pdfs');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Professional CSS for the PDF
const pdfStyle = `
body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #333;
    padding: 20px;
}
h1 {
    color: #1a365d; /* Dark Blue */
    text-align: center;
    text-transform: uppercase;
    font-size: 24pt;
    margin-bottom: 5px;
    border-bottom: 3px solid #2563EB;
    padding-bottom: 10px;
}
h2 {
    color: #2563EB; /* Primary Blue */
    text-align: center;
    font-size: 16pt;
    margin-top: 0;
    margin-bottom: 30px;
    font-style: italic;
}
h3 {
    color: #1a365d;
    font-size: 14pt;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    margin-top: 25px;
}
blockquote {
    background: #f0f9ff;
    border-left: 5px solid #2563EB;
    margin: 20px 0;
    padding: 15px;
    color: #1e40af;
    font-weight: bold;
    font-size: 12pt;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}
th {
    background-color: #1e40af;
    color: white;
    padding: 10px;
    text-align: left;
    font-size: 10pt;
}
td {
    border: 1px solid #e2e8f0;
    padding: 10px;
    font-size: 10pt;
    vertical-align: top;
}
tr:nth-child(even) {
    background-color: #f8fafc;
}
.warning {
    color: #dc2626;
    font-weight: bold;
    text-align: center;
    border: 2px solid #dc2626;
    padding: 10px;
    margin: 20px 0;
}
.footer {
    font-size: 8pt;
    text-align: center;
    color: #94a3b8;
    margin-top: 50px;
}
`;

async function generatePdfs() {
    const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.md'));
    
    console.log(`Found ${files.length} templates to convert...`);

    for (const file of files) {
        const inputPath = path.join(templatesDir, file);
        const outputPath = path.join(outputDir, file.replace('.md', '.pdf'));

        console.log(`Converting ${file}...`);

        try {
            await mdToPdf(
                { path: inputPath },
                {
                    dest: outputPath,
                    stylesheet: undefined, // We insert CSS manually via css property
                    css: pdfStyle,
                    pdf_options: {
                        format: 'A4',
                        margin: '20mm',
                        printBackground: true,
                        displayHeaderFooter: true,
                        headerTemplate: '<div style="font-size: 8px; margin-left: 20mm; color: #cbd5e1;">YourWonClaim Evidence Log</div>',
                        footerTemplate: '<div style="font-size: 8px; margin-left: 20mm; text-align: center; width: 100%; color: #cbd5e1;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
                    }
                }
            );
            console.log(`✅ Generated: ${file.replace('.md', '.pdf')}`);
        } catch (error) {
            console.error(`❌ Error converting ${file}:`, error);
        }
    }
    console.log('All PDFs generated successfully!');
}

generatePdfs();
