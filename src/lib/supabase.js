import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://pcmodyxstzffvnolfqfc.supabase.co
const supabaseKey = process.env.sb_publishable_HRskRteyncYuWcUoCgodqA_qgrdyzqt

export const supabase = createClient(supabaseUrl, supabaseKey)