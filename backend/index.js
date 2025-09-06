const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { google } = require('googleapis');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'midfield-secret', resave: false, saveUninitialized: true }));

const clients = [];
const vendors = [];
const groups = [];
const respondents = [];

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    prompt: 'consent',
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  req.session.tokens = tokens;
  res.redirect(process.env.FRONTEND_URL || '/');
});

const ensureAuth = (req, res, next) => {
  if (!req.session.tokens) return res.status(401).json({ error: 'Unauthorized' });
  oauth2Client.setCredentials(req.session.tokens);
  next();
};

app.post('/api/clients', ensureAuth, (req, res) => {
  const client = { id: `C${clients.length + 1}`, ...req.body };
  clients.push(client);
  res.status(201).json(client);
});

app.get('/api/clients', ensureAuth, (req, res) => res.json(clients));

app.post('/api/vendors', ensureAuth, (req, res) => {
  const vendor = { id: `V${vendors.length + 1}`, ...req.body };
  vendors.push(vendor);
  res.status(201).json(vendor);
});

app.get('/api/vendors', ensureAuth, (req, res) => res.json(vendors));

app.post('/api/groups', ensureAuth, (req, res) => {
  const group = { id: `G${groups.length + 1}`, ...req.body };
  groups.push(group);
  res.status(201).json(group);
});

app.get('/api/groups', ensureAuth, (req, res) => res.json(groups));

app.get('/redirect/:groupId/:vendorId/:status', (req, res) => {
  const { groupId, vendorId, status } = req.params;
  respondents.push({ id: `R${respondents.length + 1}`, groupId, vendorId, status, timestamp: new Date() });
  const surveyLink = 'https://client-surveylink.com/survey123'; // Placeholder
  res.redirect(surveyLink);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));

