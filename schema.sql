-- 1. Create Tables

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'dosen' CHECK (role IN ('admin', 'dosen')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: rooms
CREATE TABLE IF NOT EXISTS public.rooms (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    status TEXT DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Penuh', 'Maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: courses
CREATE TABLE IF NOT EXISTS public.courses (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: schedules
CREATE TABLE IF NOT EXISTS public.schedules (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
    room_id BIGINT REFERENCES public.rooms(id) ON DELETE CASCADE,
    lecturer TEXT, -- Nama dosen (text)
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Relasi ke profil (opsional)
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    borrow_name TEXT,
    room_name BIGINT REFERENCES public.rooms(id) ON DELETE CASCADE, -- Disimpan sebagai ID (room_id)
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Seed Data

-- Initial Rooms
INSERT INTO public.rooms (name, description, status) VALUES 
('Lab Komputer 1', 'Ruangan dengan 30 PC, AC, dan Proyektor.', 'Tersedia'),
('Lab Komputer 2', 'Ruangan dengan 30 PC, AC, dan Proyektor.', 'Tersedia'),
('Ruang Teori A', 'Kapasitas 40 Mahasiswa.', 'Tersedia'),
('Ruang Teori B', 'Kapasitas 40 Mahasiswa.', 'Tersedia')
ON CONFLICT DO NOTHING;

-- Initial Courses
INSERT INTO public.courses (name, code) VALUES 
('Pemrograman Web', 'PW101'),
('Basis Data', 'BD202'),
('Jaringan Komputer', 'JK303'),
('Kecerdasan Buatan', 'AI404')
ON CONFLICT DO NOTHING;

-- 3. RLS (Row Level Security) - Opsional tetapi disarankan untuk Supabase
-- Anda mungkin perlu mengonfigurasi ini di dashboard Supabase jika RLS diaktifkan.

-- 4. Triggers (Opsional: Membuat profile otomatis saat user sign up)
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 'dosen');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/
