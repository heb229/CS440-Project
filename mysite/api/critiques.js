import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { movie_id } = req.query

    try {
      // Select critiques and include movie title
      let query = supabase
        .from('movie_critiques')
        .select(`
          *,
          movies!inner(title)
        `) // assumes foreign key is set up in Supabase

      if (movie_id) {
        query = query.eq('movie_id', movie_id)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) return res.status(500).json({ error: error.message })

      // Map for frontend convenience
      const critiques = data.map(c => ({
        id: c.id,
        movie_id: c.movie_id,
        movie_title: c.movies.title,
        title: c.title,
        author: c.author,
        content: c.content,
        created_at: c.created_at
      }))

      return res.status(200).json(critiques)
    } catch (err) {
      console.error('API error:', err)
      return res.status(500).json({ error: err.message })
    }
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
