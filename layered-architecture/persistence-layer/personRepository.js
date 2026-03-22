import db from "../database-layer/db.js"

// function to retrieve a persons details
export async function getPersonDetails(id=null){
    let sql = `SELECT * FROM people WHERE id=$1`;
    const params = [id];

    const response = await db.query(sql, params);
    return response.rows;
}

// function to retrieve the movies a person acted in
export async function getPersonActIn(id=null){
    let sql = `SELECT * FROM movies INNER JOIN movie_cast ON movies.id = 
    movie_cast.movie_id WHERE movie_cast.person_id = $1`;
    const params = [id];
    const response = await db.query(sql, params);
    return response.rows;
}

// function to retrieve movies a person directed
export async function getMoviesDirected(id=null){
    let sql = `SELECT * FROM movies WHERE director_id = $1`;
    const params = [id];
    const response = await db.query(sql, params);
    return response.rows;
}
