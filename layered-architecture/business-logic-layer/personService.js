import { getPersonDetails, getPersonActIn, getMoviesDirected } from "../persistence-layer/personRepository.js";

// function to retrieve a persons details, using a persons id
export async function getPerson(id=null){
    return await getPersonDetails(id);
}

// function to retrieve a list of movies a person acted in, using a persons id
export async function getActedMovies(id=null){
    return await getPersonActIn(id);
}

// function to retrieve a list of movies a person directed, using a persons id
export async function getDirectedMovies(id=null){
    return await getMoviesDirected(id);
}