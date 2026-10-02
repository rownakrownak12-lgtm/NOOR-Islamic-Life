-- ================================================================
-- NOOR — Islamic Life
-- Supabase PostgreSQL Schema & Security Rules (DDL)
-- ================================================================

-- 1. Speakers Table (বাংলাদেশের জনপ্রিয় ওয়াজ বক্তা)
CREATE TABLE IF NOT EXISTS public.speakers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bangla_name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  youtube_url TEXT NOT NULL,
  category TEXT DEFAULT 'Waz' CHECK (category IN ('Waz', 'Tafsir', 'Islamic Lecture', 'Youth Guidance')),
  featured BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Imams Table (মক্কা ও হারামের সম্মানিত ইমাম)
CREATE TABLE IF NOT EXISTS public.imams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic_name TEXT,
  title TEXT NOT NULL,
  mosque TEXT NOT NULL,
  photo_url TEXT,
  quran_url TEXT,
  khutbah_url TEXT,
  youtube_url TEXT,
  featured BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Khutbahs Table (জুমার খুতবা কালেকশন)
CREATE TABLE IF NOT EXISTS public.khutbahs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  arabic_title TEXT,
  date TEXT NOT NULL,
  hijri_date TEXT,
  language TEXT DEFAULT 'Arabic' CHECK (language IN ('Arabic', 'English', 'Urdu', 'Bengali')),
  audio_url TEXT,
  source_url TEXT DEFAULT 'https://sermons.islamic.network/',
  featured BOOLEAN DEFAULT false,
  speaker TEXT,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Duas Table (পবিত্র কুরআন ও সহীহ হাদিসের দোয়া)
CREATE TABLE IF NOT EXISTS public.duas (
  id TEXT PRIMARY KEY,
  arabic TEXT NOT NULL,
  bangla_translation TEXT NOT NULL,
  english_translation TEXT,
  bangla_transliteration TEXT,
  source TEXT NOT NULL,
  category TEXT DEFAULT 'daily' CHECK (category IN ('daily', 'morning_evening', 'forgiveness', 'protection', 'knowledge', 'parents', 'ramadan')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Reminders Table (দৈনিক ইসলামিক রিমাইন্ডার)
CREATE TABLE IF NOT EXISTS public.reminders (
  id TEXT PRIMARY KEY,
  title TEXT,
  bangla_title TEXT NOT NULL,
  content TEXT,
  bangla_content TEXT NOT NULL,
  category TEXT DEFAULT 'namaz' CHECK (category IN ('namaz', 'quran', 'parents', 'dhikr', 'jummah', 'akhlaq')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khutbahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Anonymous / Public users can read all content
CREATE POLICY "Allow public read access to speakers" ON public.speakers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to imams" ON public.imams FOR SELECT USING (true);
CREATE POLICY "Allow public read access to khutbahs" ON public.khutbahs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to duas" ON public.duas FOR SELECT USING (true);
CREATE POLICY "Allow public read access to reminders" ON public.reminders FOR SELECT USING (true);
CREATE POLICY "Allow public read access to settings" ON public.settings FOR SELECT USING (true);

-- Authenticated admins can insert, update and delete
CREATE POLICY "Allow authenticated admins full access to speakers" ON public.speakers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admins full access to imams" ON public.imams FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admins full access to khutbahs" ON public.khutbahs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admins full access to duas" ON public.duas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admins full access to reminders" ON public.reminders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admins full access to settings" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
