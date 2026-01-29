/*
Page for the actors/directors
*/

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/**
 * GET /api/person?id=45
 * Returns:
 *  - person
 *  - movies they worked on
 */
export default async function handler(req, res) {
  const { id } = req.query

  // 1️⃣ Get person
  const { data: person, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // 2️⃣ Get movies via cast table
  const { data: roles } = await supabase
    .from('movie_cast')
    .select(`
      movies (*)
    `)
    .eq('person_id', id)

  res.status(200).json({
    ...person,
    movies: roles.map(r => r.movies)
  })
}
