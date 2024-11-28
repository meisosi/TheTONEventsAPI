import express from 'express';

import search from './search';
import view from './view';

const router = express.Router();

router.use('/search', search);
router.use('/view', view);

export default router;