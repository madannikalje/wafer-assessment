import passport from 'passport';
import { Strategy } from 'passport-local'

passport.use(new Strategy({ usernameField: "email" }, (email: string, password: string, done) => {
    console.log( email, password )
    done(null,true)
}));