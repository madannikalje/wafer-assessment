import { smsService } from './../services/sms.service';
import { generateToken } from './../utils/index';
import { loginBodyValidator, verifyBodyValidator, otpSendBodyValidator } from './../middlewares/validators';
import { Router, Request, Response } from 'express';
import { UniqueViolationError } from 'objection';
import { UserModel } from '../database';
import { signupBodyValidator } from '../middlewares/validators';
import bcrypt from 'bcrypt';

export const userRoute = (app: Router) => {
    app.post('/auth/signup',
        signupBodyValidator,
        async (req: Request, res: Response) => {
            UserModel.query().insert({ ...req.body })
                .then((user) => {
                    smsService.sendVerificationCode(req.body.mobile)
                        .then(() => {
                            res.status(201).send({ message: 'User created and verfication code has been sent' });
                        })
                        .catch(err => {
                            res.status(400).send({ message: 'Error sending verification code' });
                        })
                })
                .catch(err => {
                    if (err instanceof UniqueViolationError) {
                        res.status(400).send({ message: 'Mobile or email already exists' });
                    }
                })
        }
    )

    app.post('/auth/login',
        loginBodyValidator,
        async (req: Request, res: Response) => {
            UserModel.query().findOne({ email: req.body.email })
                .then(async (user) => {
                    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
                    if (isPasswordValid) {
                        if (user.verified) {
                            res.status(200).send({
                                message: 'Logged in',
                                ...await generateToken({
                                    id: user.id,
                                    email: user.email,
                                    mobile: user.mobile,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    verified: user.verified
                                })
                            })
                        } else {
                            res.status(400).send({ message: 'User not verified' });
                        }
                    } else {
                        res.status(400).send({ message: 'Invalid credentials' });
                    }
                })
                .catch(err => {
                    res.status(400).send({ message: 'Invalid credentials' });
                })
        }
    )

    app.post('/auth/verify',
        verifyBodyValidator,
        async (req: Request, res: Response) => {
            UserModel.query().findOne({ mobile: req.body.mobile })
                .then((user) => {
                    if (user) {
                        if (user.verified) {
                            res.status(400).send({ message: 'User already verified' });
                        } else {
                            smsService.verifyCode(req.body.mobile, req.body.code)
                                .then((res: any) => {
                                    if (res.valid) {
                                        UserModel.query()
                                            .findOne({ mobile: req.body.mobile })
                                            .patch({ verified: true })
                                            .then((user) => {
                                                res.status(200).send({ message: 'User verified' });
                                            })
                                            .catch(err => {
                                                res.status(400).send({ message: 'Error verifying user' });
                                            })
                                    } else {
                                        res.status(400).send({ message: 'Invalid code' });
                                    }
                                })
                                .catch(err => {
                                    res.status(400).send({ message: 'Invalid code' });
                                })
                        }
                    } else {
                        res.status(400).send({ message: 'User not found' });
                    }
                })
                .catch(err => {
                    res.status(400).send({ message: 'Internal server error' });
                })
        }
    )

    app.post('/auth/otp/resend',
        otpSendBodyValidator,
        async (req: Request, res: Response) => {
            UserModel.query().findOne({ mobile: req.body.mobile })
                .then((user) => {
                    if (user) {
                        if (user.verified) {
                            res.status(400).send({ message: 'User already verified' });
                        } else {
                            smsService.sendVerificationCode(req.body.mobile)
                                .then(() => {
                                    res.status(200).send({ message: 'Verification code has been sent' });
                                })
                                .catch(err => {
                                    res.status(400).send({ message: 'Error sending verification code' });
                                })
                        }
                    } else {
                        res.status(400).send({ message: 'User not found' });
                    }
                })
                .catch(err => {
                    res.status(400).send({ message: 'Internal server error' });
                })
        }
    )

}