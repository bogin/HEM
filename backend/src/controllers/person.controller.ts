import { Request, Response } from 'express';
import personService from '../services/person.service';

class PersonController {
   
    constructor() {}

    async getPersons(req: Request, res: Response): Promise<void> {
        try {
            const lastId = req.query.lastId ? parseInt(req.query.lastId as string) : undefined;
            const limit = parseInt(req.query.limit as string) || 20;
            
            const personsData = await personService.getPersons({ lastId, limit });
            res.json(personsData);
        } catch (error) {
            console.error('Error fetching persons:', error);
            res.status(500).json({ error: 'Failed to fetch persons' });
        }
    }

    async getPersonById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const person = await personService.getPersonById(id);

            if (!person) {
                res.status(404).json({ error: 'Person not found' });
                return;
            }

            res.json(person);
        } catch (error) {
            console.error('Error fetching person:', error);
            res.status(500).json({ error: 'Failed to fetch person' });
        }
    }

    async getPersonSamples(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const person = await personService.getPersonById(id);

            if (!person) {
                res.status(404).json({ error: 'Person not found' });
                return;
            }

            const samples = await personService.getPersonSamples(id);
            res.json(samples);
        } catch (error) {
            console.error('Error fetching person samples:', error);
            res.status(500).json({ error: 'Failed to fetch person samples' });
        }
    }
}

const personController = new PersonController();
export default personController;