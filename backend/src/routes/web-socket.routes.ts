import { Router } from 'express';
import wsConnectionManager from '../managers/web-socket.manager';

const router = Router();

router.post('/ws/stop/:personId', (req, res) => {
    const personId = parseInt(req.params.personId);
    if (isNaN(personId)) {
        res.status(400).json({ error: 'Invalid person ID' });
        return;
    }

    wsConnectionManager.stopStreaming(personId);
    res.json({ message: `Stopped streaming for person ${personId}` });
});

export default router;