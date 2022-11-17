import { Router } from "express";
import { upload } from "../../../middlewares/upload";

const api = Router();

// Get All Beer :: [GET] > /api/beers
api.get("/", async ({ prisma }, response) => {
  try {
    const beers = await prisma.beer.findMany();

    response.status(200).json({
      data: { beers },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Get One beer by ID :: [GET] > /api/beers/:id
api.get("/:id", async ({ prisma, params }, response) => {
  try {
    const beer = await prisma.beer.findUnique({
      where: { id: Number(params.id) },
    });
    if (!beer) {
      return response.status(400).json({
        error: `Unknown resource`,
      });
    }

    response.status(200).json({
      data: { beer },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Delete One beer by ID :: [DELETE] > /api/beers/:id
api.delete("/:id", async ({ prisma, params }, response) => {
  try {
    const beer = await prisma.beer.findUnique({
      where: { id: Number(params.id) },
    });

    if (!beer) {
      return response.status(400).json({
        error: `Unknown beer with ID: ${params.id}`,
      });
    }

    await prisma.beer.delete({ where: { id: Number(params.id) } });

    response.status(204).end();
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Update One beer :: [PUT] > /api/beers/:id
api.put("/:id", async ({ prisma, params, body }, response) => {
  const beer = await prisma.beer.findUnique({
    where: { id: Number(params.id) },
  });

  if (!beer) {
    return response.status(400).json({
      error: `Unknown beer with ID: ${params.id}`,
    });
  }

  try {
    const { name, description, picture, userId, typeId } = body;

    const beerUpdated = await prisma.beer.update({
      where: { id: beer.id },
      data: {
        name: name || beer.name,
        description: description || beer.description,
        picture: picture || beer.picture,
        userId: userId || beer.userId,
        typeId: typeId || beer.typeId,
      },
    });

    response.status(201).json({
      data: { beerUpdated },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Create One beer :: [POST] > /api/beers
api.post("/", async ({ prisma, body }, response) => {    
    // Checking mandatory fields
    const missingFields = Object.keys(body).filter(
      (field) => !["name", "description", "userId", "typeId"].includes(field)
    );
  
    if (missingFields.length > 0) {
      return response.status(400).json({
        error: `Missing fields: ${missingFields.join()}`,
      });
    }
  
    try {
      const { name, description, userId, typeId } = body;
  
      const beer = await prisma.beer.create({
        data:  {name, description, userId, typeId}
      });
  
      response.status(200).json({
        data: { beer },
      });
    } catch (error) {
      response.status(400).json({
        error: error.message,
      });
    }
  });

  api.post(
    '/:id/picture',
    upload.single('picture'),
    async ({prisma, params, file}, res) => {
      try {
        const beer = await prisma.beer.findUnique({
          where: { id: Number(params.id) },
        });

        if (!beer) {
          return res.status(400).json({
            error: `Unknown resource`,
          });
        }
  
        await prisma.beer.update({
          where: { id: beer.id },
          data: {
            picture: file
              ? file.path.replace(process.env.STORAGE_PATH, '')
              : '',
          },
        })
  
        res.status(204).json({
          msg: "success",
        });
      } catch (error) {
        res.status(500).json({
          error: error.message,
        });
      }
    },
  )
  

export default api;
