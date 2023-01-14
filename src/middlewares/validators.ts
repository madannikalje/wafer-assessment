import { celebrate, isCelebrateError, Joi, Segments } from 'celebrate'
import { STATUS_CODES } from 'http'

export const signupBodyValidator = celebrate( {
    [ Segments.BODY ]: Joi.object( {
        email: Joi.string().email().required(),
        mobile: Joi.string().alphanum().min( 10 ).required(),
        password: Joi.string().alphanum().min( 6 ).required(),
        firstName: Joi.string().alphanum().min( 3 ).max( 30 ).required(),
        lastName: Joi.string().alphanum().min( 3 ).max( 30 ).required(),
    } )
} )

export const loginBodyValidator = celebrate( {
    [ Segments.BODY ]: Joi.object( {
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min( 6 ).required(),
    } )
} )

export const verifyBodyValidator = celebrate( {
    [ Segments.BODY ]: Joi.object( {
        mobile: Joi.string().alphanum().min( 10 ).required(),
        code: Joi.string().alphanum().min( 6 ).required(),
    } )
} )

export const otpSendBodyValidator = celebrate( {
    [ Segments.BODY ]: Joi.object( {
        mobile: Joi.string().alphanum().min( 10 ).required(),
    } )
} )

export const validatorErrorHandler = ( err: any, req: any, res: any, next: any ) => {
    if ( err.name === 'UnauthorizedError' ) {
        return res.status( err.status ).send( { message: err.message } ).end()
    }

    if ( isCelebrateError( err ) ) {
        const messages = err.details
            .get( 'body' )
            .details.map( ( error: any ) => {
                return error.message
            } )
        console.log()
        return res
            .status( STATUS_CODES.BAD_REQUEST )
            .send( { message: messages } )
            .end()
    }

    return next( err )
}
