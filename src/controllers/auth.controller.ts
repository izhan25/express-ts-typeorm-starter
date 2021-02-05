import { isEmpty, validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    try {
        let errors: any;

        errors = {}
        const emailUser = await User.findOne({ email })
        const usernameUser = await User.findOne({ username })

        if (emailUser) errors.email = 'Email is already taken'
        if (usernameUser) errors.username = 'Username is already taken'

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'failed',
                errors
            });
        }

        const user = new User({ username, email, password });

        errors = validate(user);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        await user.save();

        return res.json(user);

    } catch (e) {
        next(e);
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body

    try {
        let errors: any;
        errors = {};
        if (isEmpty(username)) errors.username = 'Username must not be empty';
        if (isEmpty(password)) errors.password = 'Password must not be empty';
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'failed',
                errors
            });
        }

        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({
            message: 'not found',
            error: `User not found: ${username}`
        });

        const passwordMathces = await bcrypt.compare(password, user.password);

        if (!passwordMathces) {
            return res.status(401).json({
                message: 'failed',
                error: 'Password is incorrect',
            });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET);

        res.set(
            'Set-Cookie',
            cookie.serialize('token', token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600,
                path: '/',
            })
        );

        return res.json({
            message: 'success',
            data: user,
        });

    } catch (e) {
        next(e);
    }
}

export const AuthController = {
    register,
    login
}