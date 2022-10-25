import { Router } from "express";

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
      (field) => !["name", "description", "picture", "userId", "typeId"].includes(field)
    );
  
    if (missingFields.length > 0) {
      return response.status(400).json({
        error: `Missing fields: ${missingFields.join()}`,
      });
    }
  
    try {
      const { name, description, picture, userId, typeId } = body;
  
      const beer = await prisma.beer.create({
        data:  {name, description, picture, userId, typeId}
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
  

export default api;
