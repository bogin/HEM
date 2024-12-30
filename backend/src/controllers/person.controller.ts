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
}

const personController = new PersonController();
export default personController;