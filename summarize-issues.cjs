const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let API_KEY = null;
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    const line = lines.find(l => l.startsWith('SERANKING_API_KEY='));
    API_KEY = line ? line.split('=')[1].trim() : null;
}

const AUDIT_ID = 700665691;

async function fetchIssues() {
    const url = `https://api.seranking.com/v1/site-audit/audits/report?id=${AUDIT_ID}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('\n--- TOP ISSUES (Value > 0) ---');
            const issues = [];
            function traverse(obj) {
                if (!obj || typeof obj !== 'object') return;
                for (const key in obj) {
                    const item = obj[key];
                    if (item && typeof item === 'object') {
                        if (item.hasOwnProperty('value') && item.value > 0) {
                            issues.push({
                                code: key,
                                value: item.value,
                                label: item.label || key
                            });
                        } else {
                            traverse(item);
                        }
                    }
                }
            }
            traverse(data);
            issues.sort((a, b) => b.value - a.value);
            issues.forEach(issue => {
                console.log(`${issue.label}: ${issue.value}`);
            });
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (e) {
        console.error(e);
    }
}

fetchIssues();
