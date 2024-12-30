import { Router } from 'express';
import personController from '../controllers/person.controller';

const router = Router();

router.get('/persons', personController.getPersons);

export default router;