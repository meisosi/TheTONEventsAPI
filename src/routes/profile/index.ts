import express from 'express';

import me from './me';
import wallet from './wallet';

const router = express.Router();

router.use('/me', me);
router.use('/wallet', wallet);

export default router;