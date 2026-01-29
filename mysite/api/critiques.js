import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { movie_id } = req.query

  if (!movie_id) return res.status(400).json({ error: 'movie_id is required' })

  try {
    const { data, error } = await supabase
      .from('movie_critiques')
      .select('*')
      .eq('movie_id', movie_id)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })

    res.status(200).json(data)
  } catch (err) {
    console.error('API error:', err)
    res.status(500).json({ error: err.message })
  }
}
