const { Review, Listing, User } = require('../models');

// GET /api/reviews/listing/:listingId
const getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { listingId: req.params.listingId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ data: reviews });
  } catch (error) {
    next(error);
  }
};

// POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body;

    // Verificar que el alojamiento existe
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      res.status(404);
      throw new Error('Alojamiento no encontrado.');
    }

    // No puedes reseñar tu propio alojamiento
    if (listing.hostId === req.user.id) {
      res.status(400);
      throw new Error('No puedes escribir una reseña de tu propio alojamiento.');
    }

    // Verificar si ya dejó una reseña
    const existingReview = await Review.findOne({
      where: { userId: req.user.id, listingId },
    });
    if (existingReview) {
      res.status(400);
      throw new Error('Ya has dejado una reseña para este alojamiento.');
    }

    const review = await Review.create({
      userId: req.user.id,
      listingId,
      rating,
      comment,
    });

    // Actualizar media del alojamiento
    const allReviews = await Review.findAll({ where: { listingId } });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await listing.update({
      averageRating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      message: 'Reseña creada correctamente',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Reseña no encontrada.');
    }

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('No tienes permiso para eliminar esta reseña.');
    }

    const listingId = review.listingId;
    await review.destroy();

    // Recalcular media
    const allReviews = await Review.findAll({ where: { listingId } });
    const listing = await Listing.findByPk(listingId);

    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await listing.update({
        averageRating: avgRating.toFixed(1),
        totalReviews: allReviews.length,
      });
    } else {
      await listing.update({ averageRating: 0, totalReviews: 0 });
    }

    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getListingReviews, createReview, deleteReview };
