import { decode, sign, verify } from "jsonwebtoken"
import { Constructable } from 'typedi'
import { EntitySchema } from 'typeorm'

export const generateToken = async ( payload: any, expiry: string = '30d' ) => {

    const secret = process.env[ 'JWT_SECRET' ]
    const accessToken = sign( payload, secret, {
        expiresIn: expiry
    } )
    return {
        accessToken
    }
}