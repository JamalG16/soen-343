import express, { Request, Response } from 'express';
import TransactionService from '../services/TransactionService';
import { Administrator, Transaction } from '../models';

const cartController = express.Router();

declare global {
    namespace Express {
        export interface Request {
            user?: import('../models/User').User;
        }
    }
}

// @requires({
//     req.user instanceof Client,
//     req.user.id === req.params.id,
//     TransactionService.viewCart(req.params.id) !== null,
// })
cartController.get('/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (req.user instanceof Administrator) {
        return res.status(405).end();
    }

    const { id: userId } = req.params;

    if (!userId) {
        return res.status(404).end();
    }

    // tslint:disable-next-line:triple-equals
    if (req.user.id != userId) {
        return res.status(403).end();
    }

    try {
        const cart = await TransactionService.viewCart(userId);
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(404).end();
    }
});

// @requires({
//     req.user instanceof Client,
//     req.user.id === req.params.id,
// })
cartController.post('/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (req.user instanceof Administrator) {
        return res.status(405).end();
    }

    const { id: userId } = req.params;
    const { items: catalogItemIds } = req.body;

    // tslint:disable-next-line:triple-equals
    if (req.user.id != userId) {
        return res.status(403).end();
    }
    try {
        const cart = await TransactionService.updateCart(catalogItemIds, userId);
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(400).end();
    }
});

// @requires(
//     req.user instanceof Client,
//     req.user.id === req.params.id,
//     TransactionService.carts.has(req.user.id) === true
// )
// @ensures(
//     TransactionService.carts.has(req.user.id) === false,
//     TransactionService.carts.size() === $old(TransactionService.carts.size()) - 1
// )
cartController.delete('/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (req.user instanceof Administrator) {
        return res.status(405).end();
    }

    const { id: userId } = req.params;
    const cancelled = await TransactionService.cancelTransaction(userId);

    if (cancelled) {
        return res.status(200).end();
    }
    return res.status(400).end();

});

export { cartController };
