import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";

import authentification from './authentification'
import secured from './secured'

const routes = Router()

routes.use('/auth', authentification)
routes.use("/", authenticateToken, secured);

export default routes;
