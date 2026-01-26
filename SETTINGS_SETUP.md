# Setup Supabase Storage untuk Avatar Upload

## Langkah-langkah Setup

### 1. Buat Storage Bucket di Supabase Console

1. Buka Supabase Dashboard: https://app.supabase.com
2. Pilih project Anda
3. Buka **Storage** di sidebar
4. Klik **Create a new bucket**
5. Isi form:
   - **Name**: `profiles`
   - **Public bucket**: ✅ (Centang agar bisa public)
   - Klik **Create bucket**

### 2. Setup RLS Policy (Optional tapi Recommended)

Di bucket `profiles`, buka **Policies**:

```sql
-- Buat policy untuk upload
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Buat policy untuk read
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'profiles');

-- Buat policy untuk update
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE USING (
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Buat policy untuk delete
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE USING (
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Update Database Schema

Pastikan tabel `profiles` memiliki kolom `avatar_url`:

```sql
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
```

## Feature yang Sudah Tersedia

✅ **Upload Foto Profil**
- Click icon camera di avatar untuk upload
- Support format: JPG, PNG, GIF, WebP
- Ukuran maks: 10MB (default browser)

✅ **Ubah Nama**
- Input nama lengkap di My Account tab
- Click tombol "Simpan" untuk update
- Real-time update di context

✅ **Ganti Password**
- Minimal 6 karakter
- Harus konfirmasi password
- Password harus cocok
- Enkripsi via Supabase Auth

✅ **Modal & Standalone Page**
- Modal accessible via Sidebar > Settings button
- Standalone page di `/dashboard/settings`

## File yang Dibuat

1. `src/components/SettingsModal.js` - Modal settings lengkap
2. `src/app/dashboard/settings/page.js` - Halaman settings standalone
3. `src/app/api/auth/upload-avatar/route.js` - API route untuk upload

## Testing

1. Login ke aplikasi
2. Klik Settings di Sidebar
3. Upload foto, ubah nama, atau ganti password
4. Check apakah perubahan ter-save di database

## Troubleshooting

**Foto tidak upload?**
- Pastikan bucket `profiles` sudah dibuat
- Check RLS policy di Supabase
- Cek browser console untuk error

**Password update error?**
- Pastikan password minimal 6 karakter
- Password baru harus cocok saat confirm

**Nama tidak ter-update?**
- Pastikan sudah login (check AuthContext)
- Reload halaman untuk refresh data
