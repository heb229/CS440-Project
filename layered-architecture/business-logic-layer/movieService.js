import { getMovieById, getDirectorById, getCastByMovieId, getMovieCatalog} from "../persistence-layer/movieRepository.js";

// function to retrieve a specific movie, using a provided movie id and returns the movie
export async function getMovie(movieId=null){
    return await getMovieById(movieId);
}

// function to retrive a specific director, using a director id and returning the director
export async function getDirector(directorId=null){
    return await getDirectorById(directorId);
}

// function to retrieve a cast for a movie, using a provided movie id and returning the list of people
export async function getCast(movieId=null){
    return await getCastByMovieId(movieId);
}

// function to retrieve movies based on given conditions (genre, AND/OR, etc)
export async function getCatalog(catalog){
    return await getMovieCatalog(catalog);
}