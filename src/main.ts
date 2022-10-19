/* Prelude */
import dotenv from 'dotenv'
dotenv.config()
/* End Of Prelude */

import { launch } from './server'

const port = parseInt(process.env.PORT) || 8080
launch(port)
