console.log("supabase 라이브러리 상태:", typeof supabase);

const supabase = supabase.createClient(
  'https://wcjzwjxdpxvwrwkbjeyi.supabase.co',
  'sb_publishable_EGSt0BKAsLxDpQuzGMcBlw_IpAyOyGi'
);

window.supabase = supabase;