import express from 'express';

const router = express.Router({ mergeParams: true });

router.use('/example', require('./ExampleRoute'));
router.use('/auth', require('./AuthRoute'));

export default router;
