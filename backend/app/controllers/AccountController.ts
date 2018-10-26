import express from 'express';
import AccountService from '../services/AccountService';

const accountRouter = express.Router();

accountRouter.post('/', AccountService.createAccount);
accountRouter.post('/login', AccountService.login);
accountRouter.get('/', AccountService.getActiveUsers);

export { accountRouter };