import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/**
 * GET /api/movies
 * Query params:
 *  - search (partial title)
 *  - genre (comma-separated for multiple genres)
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

  // Search by partial title
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // Filter by genre(s)
  if (genre) {
    // split comma-separated genres
    const genres = genre.split(',').map(g => g.trim())
    
    // match any genre partially
    // For text field, use OR conditions with ilike
  let genreFilter = query 
    genres.forEach((g, i) => { 
      if (i === 0) { 
        genreFilter = genreFilter.ilike('genre', %${g}%) 
    } else { 
      genreFilter = genreFilter.or(genre.ilike.%${g}%) 
    } 
  }) 
  query = genreFilter 
  }


  // Filter by year
  if (year) {
    query = query.eq('year', parseInt(year))
  }

  // Filter by decade
  if (decade) {
    const start = parseInt(decade)
    query = query.gte('year', start).lt('year', start + 10)
  }

  // Sorting
  const ascending = order.toLowerCase() === 'asc'
  query = query.order(sort, { ascending })

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
}
