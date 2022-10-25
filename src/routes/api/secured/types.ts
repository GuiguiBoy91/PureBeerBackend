import { Router } from "express";

const api = Router();

// Get All Type :: [GET] > /api/types
api.get("/", async ({ prisma }, response) => {
  try {
    const types = await prisma.type.findMany();

    response.status(200).json({
      data: { types },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Get One type by ID :: [GET] > /api/types/:id
api.get("/:id", async ({ prisma, params }, response) => {
  try {
    const type = await prisma.type.findUnique({
      where: { id: Number(params.id) },
    });
    if (!type) {
      return response.status(400).json({
        error: `Unknown resource`,
      });
    }

    response.status(200).json({
      data: { type },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Delete One type by ID :: [DELETE] > /api/types/:id
api.delete("/:id", async ({ prisma, params }, response) => {
    try {
      const type = await prisma.type.findUnique({
        where: { id: Number(params.id) },
      });
  
      if (!type) {
        return response.status(400).json({
          error: `Unknown type with ID: ${params.id}`,
        });
      }
  
      await prisma.type.delete({ where: { id: Number(params.id) } });
  
      response.status(204).end();
    } catch (error) {
      response.status(400).json({
        error: error.message,
      });
    }
  });
  
  // Update One type :: [PUT] > /api/types/:id
  api.put("/:id", async ({ prisma, params, body }, response) => {
    const type = await prisma.type.findUnique({
      where: { id: Number(params.id) },
    });
  
    if (!type) {
      return response.status(400).json({
        error: `Unknown type with ID: ${params.id}`,
      });
    }
  
    try {
      const { name, description } = body;
  
      const typeUpdated = await prisma.type.update({
        where: { id: type.id },
        data: {
          name: name || type.name,
          description: description || type.description
        },
      });
  
      response.status(201).json({
        data: { typeUpdated },
      });
    } catch (error) {
      response.status(400).json({
        error: error.message,
      });
    }
  });
  
  // Create One type :: [POST] > /api/types
  api.post("/", async ({ prisma, body }, response) => {
      // Checking mandatory fields
      const missingFields = Object.keys(body).filter(
        (field) => !["name", "description"].includes(field)
      );
    
      if (missingFields.length > 0) {
        return response.status(400).json({
          error: `Missing fields: ${missingFields.join()}`,
        });
      }
    
      try {
        const { name, description } = body;
    
        const type = await prisma.type.create({
          data:  {name, description}
        });
    
        response.status(200).json({
          data: { type },
        });
      } catch (error) {
        response.status(400).json({
          error: error.message,
        });
      }
    });

export default api;
