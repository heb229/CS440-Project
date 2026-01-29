/*
Statistics information page
*/

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/*
GET /api/stats
Returns aggregated movie statistics
*/
export default async function handler(req, res) {
  const { data, error } = await supabase.rpc('movie_statistics')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
}
