import express from 'express';

const router = express.Router({ mergeParams: true });

router.use('/example', require('./ExampleRoute'));

export default router;
