import { Router } from 'express';
import personController from '../controllers/person.controller';

const router = Router();

router.get('/persons', personController.getPersons);
router.get('/persons/:id', personController.getPersonById);
router.get('/persons/:id/samples', personController.getPersonSamples);

export default router;