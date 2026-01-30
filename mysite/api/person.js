/*
Page for the actors/directors
*/

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export default async function people_handler(req, res) {
  const { id } = req.query;

  // get person
  const { data: person, error: personError } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();

  if (personError) {
    return res.status(500).json({
      error: personError.message,
    });
  }

  // movies they acted in
  const { data: actedMovies = [] } = await supabase
    .from("movie_cast")
    .select("movies(*)")
    .eq("person_id", id);

  // movies they directed
  const { data: directedMovies = [] } = await supabase
    .from("movies")
    .select("*")
    .eq("director_id", id);

  res.status(200).json({
    ...person,
    actedMovies: actedMovies.map((r) => r.movies),
    directedMovies,
  });
}
