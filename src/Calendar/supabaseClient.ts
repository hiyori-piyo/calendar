import { createClient } from "@supabase/supabase-js";

// 直接文字列を書くのではなく、環境変数を参照するように変更
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("URL:", supabaseUrl); // これが undefined なら読み込めていない
  console.log("KEY:", supabaseAnonKey);
  throw new Error("Missing Supabase Environment Variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
