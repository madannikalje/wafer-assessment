import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt'

passport.use(new Strategy({
    secretOrKey: process.env['JWT_SECRET'],
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, (jwt_payload: any, done) => {
    console.log(jwt_payload)
    done(null, true)
}));