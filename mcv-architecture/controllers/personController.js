import PersonModel from '../models/personModel.js';

class PersonController
{
    // Render the page for a specific person (actor or director).
    static async details(req, res)
    {
        try
        {
            const personId = req.params.id;
            const person = await PersonModel.getById(personId);

            // If the person does not exist, return a 404 response.
            if (!person)
            {
                return res.status(404).send('Person not found');
            }

            res.render('person',
            {
                person: person
            });
        }
        catch (error)
        {
            res.status(500).send(error.message);
        }
    }
}

export default PersonController;