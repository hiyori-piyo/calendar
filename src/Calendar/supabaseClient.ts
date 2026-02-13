import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://obmakkjffwjkmiyldyvy.supabase.co'
const supabaseKey = 'sb_publishable_uCR9exQz1jQ_qmIhkckXZQ_9Nd_FBq3'

export const supabase = createClient(supabaseUrl, supabaseKey)