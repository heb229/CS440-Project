import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { search, genre, sort = 'title', order = 'asc', year, decade } = req.query

  try {
    let query = supabase.from('movies').select('*')

    // Partial title search
    if (search) query = query.ilike('title', `%${search}%`)

    // Multi-genre filter
    if (genre) {
      const genres = genre.split(',').map(g => g.trim())
      if (genres.length > 0) {
        const conditions = genres.map(g => `genre.ilike.%${g}%`).join(',')
        query = query.or(conditions)
      }
    }

    // Year filter
    if (year) query = query.eq('year', parseInt(year))

    // Decade filter
    if (decade) {
      const start = parseInt(decade)
      query = query.gte('year', start).lt('year', start + 10)
    }

    // Sorting
    const ascending = order.toLowerCase() === 'asc'
    query = query.order(sort, { ascending })

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })

    res.status(200).json(data)
  } catch (err) {
    console.error('API error:', err)
    res.status(500).json({ error: err.message })
  }
}
