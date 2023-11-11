import express, { Request, Response } from 'express';
import ExampleClass from '../classes/ExampleClass';

const router = express.Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
	res.send(await ExampleClass.GetExamples());
});

module.exports = router;
