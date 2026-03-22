import db from "../database-layer/db.js";

// function provides movie details for a singular movie
export async function getMovieById(id=null){
    let sql = `SELECT * FROM movies`;
    const params = [];

    if(id){
        sql += " WHERE id = $1";
        params.push(id);
    }

    const result = await db.query(sql, params);
    return result.rows[0];
}

// function retrieves movies directed by a specific person
export async function getDirectorById(directorId=null){
    // get director
    let director = null;
    if(directorId){
        let sql = `SELECT * FROM people WHERE id = $1`;
        const params = [directorId];
        director = await db.query(sql, params)
    }
    if(director == null)
    {
        return null;
    }

    return director.rows[0];
}

// function retrieves the cast of people based on specific movie
export async function getCastByMovieId(id=null){
    // get cast
    let sql = `SELECT * FROM people INNER JOIN movie_cast ON 
    people.id = movie_cast.person_id WHERE movie_cast.movie_id = $1`;
    const params = [id];

    const castResponse = await db.query(sql, params);
    return castResponse.rows;
} 

// function retrieves movies based on provided conditions
export async function getMovieCatalog(catalogData){
    const {search, genre, mode, sort, order, year, decade} = catalogData;
    let sql = `SELECT * FROM movies`;
    const conditions = [];
    const params = [];

    // title search
    if(search){
        conditions.push(`title ILIKE $${params.length + 1}`);
        params.push(`%${search}%`);
    }

    // multi-genre filter
    if(genre){
        const genres = genre.split(",").map((g) => g.trim());
        if(genres.length > 0){
            const genreConditions = genres.map((g) => {
                params.push(`%${g}%`);
                return `genre ILIKE $${params.length}`;
            });
        
            if(mode === "or"){
                conditions.push(`(${genreConditions.join(" OR ")})`);
            }
            else{
                conditions.push(`(${genreConditions.join(" AND ")})`)
            }
        }
    }

    // year filter
    if(year){
        conditions.push(`year = $${params.length + 1}`);
        params.push(parseInt(year));
    }

    // decade filter
    if(decade){
    const start = parseInt(decade);
    conditions.push(`year >= $${params.length + 1} AND year < $${params.length + 2}`);
    params.push(start, start + 10);
    }

    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // sorting
    const validSortFields = ["title", "year", "genre"];
    const sortField = validSortFields.includes(sort) ? sort : "title";
    const sortOrder = order && order.toLowerCase() === "desc" ? "DESC" : "ASC";
    sql += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await db.query(sql, params);
    return result.rows;
}