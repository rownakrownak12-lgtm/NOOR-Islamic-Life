import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.resolve(__dirname, 'data', 'noor-db.json');

app.use(express.json());

// In-memory valid sessions token store
const activeTokens = new Set<string>();

interface DbSchema {
  admin: {
    passwordHash: string;
    updatedAt: string;
  };
  settings: Record<string, any>;
  speakers: any[];
  imams: any[];
  khutbahs: any[];
  duas: any[];
  reminders: any[];
}

function readDb(): DbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB:', err);
  }
  return {
    admin: { passwordHash: 'noor2026', updatedAt: new Date().toISOString() },
    settings: {},
    speakers: [],
    imams: [],
    khutbahs: [],
    duas: [],
    reminders: [],
  };
}

function writeDb(data: DbSchema): boolean {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  next();
}

// ================= API ROUTES =================

// Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const db = readDb();
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Compare password (default: noor2026)
  if (password === db.admin.passwordHash) {
    const token = crypto.randomBytes(32).toString('hex');
    activeTokens.add(token);
    return res.json({
      success: true,
      token,
      admin: {
        email: db.settings?.adminEmail || 'admin@noorislamic.org',
        role: 'superadmin',
      },
    });
  }

  return res.status(401).json({ error: 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token && activeTokens.has(token)) {
    const db = readDb();
    return res.json({
      authenticated: true,
      user: {
        email: db.settings?.adminEmail || 'admin@noorislamic.org',
        role: 'superadmin',
      },
    });
  }
  return res.json({ authenticated: false });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token) {
    activeTokens.delete(token);
  }
  return res.json({ success: true });
});

app.post('/api/auth/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' });
  }
  const db = readDb();
  if (currentPassword !== db.admin.passwordHash) {
    return res.status(400).json({ error: 'বর্তমান পাসওয়ার্ড সঠিক নয়' });
  }
  db.admin.passwordHash = newPassword;
  db.admin.updatedAt = new Date().toISOString();
  writeDb(db);
  return res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে' });
});

// Overview Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const db = readDb();
  return res.json({
    speakersCount: db.speakers.length,
    imamsCount: db.imams.length,
    khutbahsCount: db.khutbahs.length,
    duasCount: db.duas.length,
    remindersCount: db.reminders.length,
    activeRemindersCount: db.reminders.filter(r => r.active).length,
  });
});

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.settings);
});

app.post('/api/settings', requireAdminAuth, (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  return res.json({ success: true, settings: db.settings });
});

// Speakers
app.get('/api/speakers', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.speakers);
});

app.post('/api/speakers', requireAdminAuth, (req: Request, res: Response) => {
  const db = readDb();
  const newSpeaker = {
    ...req.body,
    id: req.body.id || `speaker-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    order: req.body.order || db.speakers.length + 1,
  };
  db.speakers.push(newSpeaker);
  writeDb(db);
  return res.status(201).json(newSpeaker);
});

app.put('/api/speakers/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.speakers.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'বক্তা পাওয়া যায়নি' });
  }
  db.speakers[index] = { ...db.speakers[index], ...req.body, id };
  writeDb(db);
  return res.json(db.speakers[index]);
});

app.delete('/api/speakers/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  db.speakers = db.speakers.filter(s => s.id !== id);
  writeDb(db);
  return res.json({ success: true });
});

// Imams
app.get('/api/imams', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.imams);
});

app.post('/api/imams', requireAdminAuth, (req: Request, res: Response) => {
  const db = readDb();
  const newImam = {
    ...req.body,
    id: req.body.id || `imam-${Date.now()}`,
    order: req.body.order || db.imams.length + 1,
  };
  db.imams.push(newImam);
  writeDb(db);
  return res.status(201).json(newImam);
});

app.put('/api/imams/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.imams.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'ইমাম পাওয়া যায়নি' });
  }
  db.imams[index] = { ...db.imams[index], ...req.body, id };
  writeDb(db);
  return res.json(db.imams[index]);
});

app.delete('/api/imams/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  db.imams = db.imams.filter(i => i.id !== id);
  writeDb(db);
  return res.json({ success: true });
});

// Khutbahs
app.get('/api/khutbahs', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.khutbahs);
});

app.post('/api/khutbahs', requireAdminAuth, (req: Request, res: Response) => {
  const db = readDb();
  const newKhutbah = {
    ...req.body,
    id: req.body.id || `khutbah-${Date.now()}`,
  };
  db.khutbahs.unshift(newKhutbah);
  writeDb(db);
  return res.status(201).json(newKhutbah);
});

app.put('/api/khutbahs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.khutbahs.findIndex(k => k.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'খুতবা পাওয়া যায়নি' });
  }
  db.khutbahs[index] = { ...db.khutbahs[index], ...req.body, id };
  writeDb(db);
  return res.json(db.khutbahs[index]);
});

app.delete('/api/khutbahs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  db.khutbahs = db.khutbahs.filter(k => k.id !== id);
  writeDb(db);
  return res.json({ success: true });
});

// Duas
app.get('/api/duas', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.duas);
});

app.post('/api/duas', requireAdminAuth, (req: Request, res: Response) => {
  const db = readDb();
  const newDua = {
    ...req.body,
    id: req.body.id || `dua-${Date.now()}`,
  };
  db.duas.push(newDua);
  writeDb(db);
  return res.status(201).json(newDua);
});

app.put('/api/duas/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.duas.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'দোয়া পাওয়া যায়নি' });
  }
  db.duas[index] = { ...db.duas[index], ...req.body, id };
  writeDb(db);
  return res.json(db.duas[index]);
});

app.delete('/api/duas/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  db.duas = db.duas.filter(d => d.id !== id);
  writeDb(db);
  return res.json({ success: true });
});

// Reminders
app.get('/api/reminders', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.reminders);
});

app.post('/api/reminders', requireAdminAuth, (req: Request, res: Response) => {
  const db = readDb();
  const newReminder = {
    ...req.body,
    id: req.body.id || `reminder-${Date.now()}`,
    active: req.body.active !== undefined ? req.body.active : true,
  };
  db.reminders.push(newReminder);
  writeDb(db);
  return res.status(201).json(newReminder);
});

app.put('/api/reminders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.reminders.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'রিমাইন্ডার পাওয়া যায়নি' });
  }
  db.reminders[index] = { ...db.reminders[index], ...req.body, id };
  writeDb(db);
  return res.json(db.reminders[index]);
});

app.delete('/api/reminders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  db.reminders = db.reminders.filter(r => r.id !== id);
  writeDb(db);
  return res.json({ success: true });
});

// Export Database Backup (JSON)
app.get('/api/backup/export', requireAdminAuth, (_req: Request, res: Response) => {
  const db = readDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="noor-backup.json"');
  return res.send(JSON.stringify(db, null, 2));
});

// Initialize Vite Dev Server Middleware or Static Production
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ NOOR Islamic Life server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
