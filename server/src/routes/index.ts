import { Router } from 'express';
import v1Routes from './v1';

const gateway = Router();

gateway.use('/v1', v1Routes);

export default gateway;
