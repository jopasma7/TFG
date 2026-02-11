const { Listing, User, Review } = require('../models');
const { Op } = require('sequelize');

// GET /api/listings
const getAllListings = async (req, res, next) => {
  try {
    const {
      city, country, type, minPrice, maxPrice,
      guests, page = 1, limit = 10,
    } = req.query;

    // Construir filtros dinámicos
    const where = { isActive: true };
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (country) where.country = { [Op.like]: `%${country}%` };
    if (type) where.type = type;
    if (minPrice) where.pricePerNight = { ...where.pricePerNight, [Op.gte]: minPrice };
    if (maxPrice) where.pricePerNight = { ...where.pricePerNight, [Op.lte]: maxPrice };
    if (guests) where.maxGuests = { [Op.gte]: guests };

    const offset = (page - 1) * limit;

    const { count, rows: listings } = await Listing.findAndCountAll({
      where,
      include: [{ model: User, as: 'host', attributes: ['id', 'name', 'avatar'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      data: listings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/listings/:id
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'name', 'avatar', 'bio'] },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, as: 'author', attributes: ['id', 'name', 'avatar'] }],
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!listing) {
      res.status(404);
      throw new Error('Alojamiento no encontrado.');
    }

    res.json({ data: listing });
  } catch (error) {
    next(error);
  }
};

// POST /api/listings
const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      hostId: req.user.id,
    });

    res.status(201).json({
      message: 'Alojamiento creado correctamente',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/listings/:id
const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error('Alojamiento no encontrado.');
    }

    // Solo el dueño puede editar
    if (listing.hostId !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('No tienes permiso para editar este alojamiento.');
    }

    await listing.update(req.body);

    res.json({
      message: 'Alojamiento actualizado correctamente',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/listings/:id
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error('Alojamiento no encontrado.');
    }

    if (listing.hostId !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('No tienes permiso para eliminar este alojamiento.');
    }

    await listing.destroy();

    res.json({ message: 'Alojamiento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
