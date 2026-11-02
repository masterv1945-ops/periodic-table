// تنظیمات عمومی Supabase برای وب‌سایت علوم نهم
// کلید publishable برای استفاده در مرورگر طراحی شده است؛ هرگز service_role را اینجا قرار ندهید.
window.SUPABASE_URL = 'https://ttdhztufduwxygavawtd.supabase.co';
window.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Et3k3zXG2-PDuUB0jpPG2Q_QbpCpS5Y';
window.SUPABASE_BUCKET = 'science9-resources';
window.createScience9SupabaseClient = function () {
  if (!window.supabase || !window.supabase.createClient) throw new Error('کتابخانه Supabase بارگذاری نشده است.');
  if (!window.__science9SupabaseClient) {
    window.__science9SupabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }
  return window.__science9SupabaseClient;
};
