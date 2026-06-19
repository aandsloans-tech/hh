import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const crmNewDir = path.join(__dirname, 'crm new');

// Logging requests to make developer flow highly transparent
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

// Default handler for main app loading
const serveIndex = (req, res) => {
    res.sendFile(path.join(crmNewDir, 'crm', 'index.html'));
};

app.get('/', serveIndex);
app.get('/index.html', serveIndex);
app.get('/crm', serveIndex);
app.get('/crm/', serveIndex);
app.get('/crm/index.html', serveIndex);

// Serve css, js, and pages directories relative to root to resolve "../css" or "../js" relative paths gracefully
app.use('/css', express.static(path.join(crmNewDir, 'css')));
app.use('/js', express.static(path.join(crmNewDir, 'js')));
app.use('/pages', express.static(path.join(crmNewDir, 'pages')));

// Support prefixed /crm/ paths
app.use('/crm/css', express.static(path.join(crmNewDir, 'css')));
app.use('/crm/js', express.static(path.join(crmNewDir, 'js')));
app.use('/crm/pages', express.static(path.join(crmNewDir, 'pages')));

// Serve physical static directory from "/crm new"
app.use(express.static(crmNewDir));

// Warm-up and healthcheck support
app.get('/healthz', (req, res) => res.status(200).send('OK'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started successfully on port ${PORT}`);
});
