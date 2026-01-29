import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { movie_id } = req.query
    if (!movie_id) return res.status(400).json({ error: 'movie_id is required' })

    const { data, error } = await supabase
      .from('movie_critiques')
      .select('*')
      .eq('movie_id', movie_id)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { movie_id, title, author, content } = req.body
    if (!movie_id || !title || !author || !content) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const { data, error } = await supabase
      .from('movie_critiques')
      .insert([{ movie_id, title, author, content }])
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  res.status(405).json({ error: 'Method not allowed' })
}
