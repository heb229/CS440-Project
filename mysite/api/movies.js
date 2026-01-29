import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/**
 * GET /api/movies
 * Query params:
 *  - search
 *  - genre
 *  - sort (title | year | rating)
 *  - order (asc | desc)
 *  - year
 *  - decade
 */
export default async function handler(req, res) {
  const {
    search,
    genre,
    sort = 'title',
    order = 'asc',
    year,
    decade
  } = req.query

  let query = supabase.from('movies').select('*')

  // search by partial title
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // filter by genre
  if (genre) {
    query = query.eq('genre', genre)
  }

  // filter by year or decade
  if (year) {
    query = query.eq('year', year)
  }

  if (decade) {
    const start = parseInt(decade)
    query = query.gte('year', start).lt('year', start + 10)
  }

  // sorting
  query = query.order(sort, { ascending: order === 'asc' })

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
}
