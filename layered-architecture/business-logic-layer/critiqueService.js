import { getAllCritiques, createCritique } from "../persistence-layer/critiqueRepository.js";

// function to retrieve critiques, using optional movieId to filter critiques and returns a list of critiques
export async function getCritiques(movieId=null){
    return await getAllCritiques(movieId);
}

// function to insert new critque, using a payload of critique data and returning newly created critique
export async function insertCritique(critiqueData){
    // validates all fields before insertion into the db
    const {movie_id, title, author, content} = critiqueData;

    if(!movie_id || !title || !author || !content){
        throw new Error("All fields are required.");
    }
    return await createCritique(critiqueData);
}