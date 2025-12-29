import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "../config/db";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"));
        }

        const existingUser = await pool.query(
          `SELECT id FROM users WHERE email = $1`,
          [email]
        );

        if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
          return done(null, { id: existingUser.rows[0].id });
        }

        
        const newUser = await pool.query(
          `
          INSERT INTO users (email, password_hash, is_verified)
          VALUES ($1, $2, true)
          RETURNING id
          `,
          [email, "OAUTH_USER"]
        );

        return done(null, { id: newUser.rows[0].id });
      } catch (err) {
        done(err as Error);
      }
    }
  )
);
