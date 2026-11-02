# بسته پنل منابع علوم نهم

## فایل‌ها
- `index.html`: نسخه اصلی سایت؛ بخش منابع به‌صورت زنده از Supabase بارگذاری می‌شود.
- `admin.html`: پنل جداگانه مدیر برای ساخت پوشه، بارگذاری، انتشار و حذف منابع.
- `supabase-config.js`: نشانی پروژه و کلید عمومی Supabase.
- `resources.js`: نمایش منابع منتشرشده در سایت اصلی.

## نکته مهم درباره فایل‌های قبلی
PDFها و تصاویر ثابتِ قبلی از کد سایت حذف شده‌اند. هیچ رکورد یا فایلی از دیتابیس و Storage پروژه Supabase پاک نشده است.

## راه‌اندازی
1. این پنج فایل را در ریشه همان مخزن GitHub Pages قرار دهید و فایل قدیمی `index.html` را با نسخه داخل بسته جایگزین کنید.
2. فایل `admin.html` را کنار `index.html` قرار دهید.
3. `supabase-config.js` باید در کنار دو فایل HTML باشد.
4. در Supabase مطمئن شوید جدول‌ها و سیاست‌های RLS قبلی برقرارند و Storage bucket دقیقاً `science9-resources` و Public است.
5. حساب مدیر باید در Authentication وجود داشته باشد و شناسه UUID همان حساب در جدول `resource_admins` ثبت شده باشد.
6. پس از انتشار، پنل مدیر از `https://YOUR-USERNAME.github.io/YOUR-REPO/admin.html` باز می‌شود.

## ساختار دیتابیس مورد انتظار
- `resource_admins(user_id)`
- `resource_folders(id, name, description, is_published, created_by, created_at, updated_at)`
- `resources(id, folder_id, title, description, file_name, storage_path, mime_type, size_bytes, is_published, created_by, created_at, updated_at)`

سایت عمومی فقط پوشه‌ها و فایل‌هایی را نشان می‌دهد که `is_published=true` دارند. پنل مدیریت برای نوشتن/حذف به ورود مدیر و RLS متکی است.

## امنیت
کلید `sb_publishable_...` کلید عمومی است و برای مرورگر مناسب است. هرگز کلید `service_role` یا رمز دیتابیس را داخل این فایل‌ها قرار ندهید. کنترل دسترسی مدیر باید در RLS سمت Supabase انجام شود؛ مخفی کردن دکمه‌ها به‌تنهایی امنیت نیست.
