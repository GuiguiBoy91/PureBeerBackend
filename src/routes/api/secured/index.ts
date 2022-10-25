import { Router } from "express";

import users from "./users";
import beers from "./beers";
import reviews from "./reviews";
import types from "./types";

const api = Router();

api.use("/users", users);
api.use("/beers", beers);
api.use("/reviews", reviews);
api.use("/types", types);


export default api;
