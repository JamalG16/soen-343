import express from 'express';
import AccountService from '../controllers/AccountService';

const accountRouter = express.Router();

accountRouter.post('/', AccountService.createAccount);
accountRouter.post('/login', AccountService.login);
accountRouter.get('/users', AccountService.getUsers);

export { accountRouter };