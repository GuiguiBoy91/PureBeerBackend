import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";

import anthentification from './anthentification'
import secured from './secured'

const routes = Router()

routes.use('/anthentification', anthentification)
routes.use("/", authenticateToken, secured);

export default routes;
