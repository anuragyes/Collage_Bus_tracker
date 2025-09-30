import express from 'express';
import { ClientLogin, ClientLogout, ClientSignup, GetClient } from '../controllers/authControllers.js';
import { isAuth } from '../Middleware/IsAuth.js';

export const AuthRouter = express.Router();
AuthRouter.post("/signup", ClientSignup);
AuthRouter.post("/login", ClientLogin);

// Private Routes (isAuth REQUIRED)
AuthRouter.get("/me", isAuth, GetClient);
AuthRouter.post("/logout", isAuth, ClientLogout);


