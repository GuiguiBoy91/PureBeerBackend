import { Router } from "express";

const api = Router();

// Get All Review :: [GET] > /api/reviews
api.get("/", async ({ prisma }, response) => {
  try {
    const reviews = await prisma.review.findMany();

    response.status(200).json({
      data: { reviews },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Get One review by ID :: [GET] > /api/reviews/:id
api.get("/:id", async ({ prisma, params }, response) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(params.id) },
    });
    if (!review) {
      return response.status(400).json({
        error: `Unknown resource`,
      });
    }

    response.status(200).json({
      data: { review },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Delete One review by ID :: [DELETE] > /api/reviews/:id
api.delete("/:id", async ({ prisma, params }, response) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(params.id) },
    });

    if (!review) {
      return response.status(400).json({
        error: `Unknown review with ID: ${params.id}`,
      });
    }

    await prisma.review.delete({ where: { id: Number(params.id) } });

    response.status(204).end();
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Update One review :: [PUT] > /api/reviews/:id
api.put("/:id", async ({ prisma, params, body }, response) => {
  const review = await prisma.review.findUnique({
    where: { id: Number(params.id) },
  });

  if (!review) {
    return response.status(400).json({
      error: `Unknown review with ID: ${params.id}`,
    });
  }

  try {
    const { rating, comment, beerId, userId } = body;

    const reviewUpdated = await prisma.review.update({
      where: { id: review.id },
      data: {
        rating: rating || review.rating,
        comment: comment || review.comment,
        beerId: beerId || review.beerId,
        userId: userId || review.userId,
      },
    });

    response.status(201).json({
      data: { reviewUpdated },
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
});

// Create One review :: [POST] > /api/reviews
api.post("/", async ({ prisma, body }, response) => {
    // Checking mandatory fields
    const missingFields = Object.keys(body).filter(
      (field) => !["rating", "comment", "beerId", "userId"].includes(field)
    );
  
    if (missingFields.length > 0) {
      return response.status(400).json({
        error: `Missing fields: ${missingFields.join()}`,
      });
    }
  
    try {
        const { rating, comment, beerId, userId } = body;
  
        const review = await prisma.review.create({
            data:  {rating, comment, beerId, userId}
        });
    
        response.status(200).json({
            data: { review },
        });
    } catch (error) {
      response.status(400).json({
        error: error.message,
      });
    }
  });
  

export default api;
