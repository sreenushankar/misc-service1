import { Router } from 'express'
import { config } from '../controllers/miscContoller';

export const router = Router();

router.route('/misc/config').get(config);
 

 