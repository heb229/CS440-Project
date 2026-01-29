/*
This is for the more details page (singular movie)
*/

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/*
GET /api/movie?id=123
Returns movie details + cast + director
*/
export default async function handler(req, res) {
  const { id } = req.query

  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      director:people!movies_director_id_fkey(*),
      cast:movie_cast(
        people(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
}
