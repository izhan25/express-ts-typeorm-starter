import { isEmpty } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        res.json({
            message: 'success',
            data: users,
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;
    try {
        const user = await User.findOne({ uuid });

        if (!user) {
            return res.status(404).json({
                message: 'not found',
                error: 'User not found',
            });
        }

        res.json({
            message: 'success',
            data: user,
        });
    } catch (e) {
        next(e);
    }
}

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;

    try {
        const user = await User.findOne({ uuid });

        if (!user) {
            return res.status(404).json({
                message: 'not found',
                error: 'User not found',
            });
        }

        await user.remove();

        res.json({
            message: 'success',
            data: user
        })

    } catch (e) {
        next(e);
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;
    const { username, email } = req.body; 

    try {
        let errors: any;
        errors = {};
        if (isEmpty(username)) errors.username = 'Username must not be empty';
        if (isEmpty(email)) errors.email = 'Email must not be empty';
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'failed',
                errors
            });
        }

        const user = await User.findOne({uuid});

        if (!user) {
            return res.status(404).json({
                message: 'not found',
                error: 'User not found',
            });
        }

        user.username = username;
        user.email = email;

        await user.save();

        res.json({
            message: 'success',
            data: user
        })

    } catch (e) {
        next(e);
    }

}

export const UserController = {
    getAll,
    get,
    destroy,
    update
}