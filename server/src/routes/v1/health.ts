import { Router } from 'express';
import { sendSuccess } from '../../utils/response';
import { MESSAGES } from '../../utils/messages';

const router = Router();

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok' }, MESSAGES.SUCCESS.FETCHED);
});

export default router;
