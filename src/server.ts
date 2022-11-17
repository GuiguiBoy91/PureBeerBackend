import express from "express";
import cors from "cors";
import routes from "./routes";
import { injectPrisma } from "./middlewares/inject-prisma";

export function launch(port: number): void {
  const application = express();

  /* Middlewares */
  application.use(express.json());
  application.use(express.static('uploads'));
  application.use(express.urlencoded({ extended: true }));
  application.use(injectPrisma());
  application.use(cors());

  /* Routes */
  application.use("/", routes);

  application.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
  });
}
