/*
This is for the more details page (singular movie)
*/
 
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export default async function movie_cast_handler(req, res) {
  const { id } = req.query;

  // get movie
  const { data: movie, error: movieError } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (movieError) {
    return res.status(500).json({
      error: movieError.message,
    });
  }

  // Get director
  let director = null;
  if (movie.director_id) {
    const { data } = await supabase
      .from("people")
      .select("*")
      .eq("id", movie.director_id)
      .single();
    director = data;
  }

  // Get cast
  const { data: cast } = await supabase
    .from("movie_cast")
    .select(
      `
      people (*)
    `,
    )
    .eq("movie_id", id);

  res.status(200).json({
    ...movie,
    director,
    cast: cast.map((c) => c.people),
  });
}
