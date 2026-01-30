import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
); 

export default async function movies_handler(req, res) {
  const {
    search,
    genre,
    mode = "or",
    sort = "title",
    order = "asc",
    year,
    decade,
  } = req.query;

  try {
    let query = supabase.from("movies").select("*");

    // partial title search
    if (search) query = query.ilike("title", `%${search}%`);

    // multi-genre filter
    if (genre) {
      const genres = genre.split(",").map((g) => g.trim());

      if (genres.length > 0) {
        if (mode === "or") {
          // OR: match any genre
          const conditions = genres.map((g) => `genre.ilike.%${g}%`).join(",");
          query = query.or(conditions);
        } else {
          // AND: must match all selected genres
          genres.forEach((g) => {
            query = query.ilike("genre", `%${g}%`);
          });
        }
      }
    }

    // Year filter
    if (year) query = query.eq("year", parseInt(year));

    // Decade filter
    if (decade) {
      const start = parseInt(decade);
      query = query.gte("year", start).lt("year", start + 10);
    }

    // Sorting
    const ascending = order.toLowerCase() === "asc";
    query = query.order(sort, { ascending });

    const { data, error } = await query;
    if (error)
      return res.status(500).json({
        error: error.message,
      });

    res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
}
