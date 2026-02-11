const { Booking, Listing, User } = require('../models');
const { Op } = require('sequelize');

// GET /api/bookings (mis reservas)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { guestId: req.user.id },
      include: [
        {
          model: Listing,
          as: 'listing',
          attributes: ['id', 'title', 'city', 'country', 'images', 'pricePerNight'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/host (reservas de mis alojamientos)
const getHostBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Listing,
          as: 'listing',
          where: { hostId: req.user.id },
          attributes: ['id', 'title', 'city'],
        },
        {
          model: User,
          as: 'guest',
          attributes: ['id', 'name', 'email', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests, notes } = req.body;

    // Verificar que el alojamiento existe
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      res.status(404);
      throw new Error('Alojamiento no encontrado.');
    }

    // No puedes reservar tu propio alojamiento
    if (listing.hostId === req.user.id) {
      res.status(400);
      throw new Error('No puedes reservar tu propio alojamiento.');
    }

    // Verificar huéspedes
    if (guests > listing.maxGuests) {
      res.status(400);
      throw new Error(`El máximo de huéspedes es ${listing.maxGuests}.`);
    }

    // Verificar disponibilidad (no hay solapamiento de fechas)
    const overlap = await Booking.findOne({
      where: {
        listingId,
        status: { [Op.in]: ['pending', 'confirmed'] },
        [Op.or]: [
          { checkIn: { [Op.between]: [checkIn, checkOut] } },
          { checkOut: { [Op.between]: [checkIn, checkOut] } },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: checkIn } },
              { checkOut: { [Op.gte]: checkOut } },
            ],
          },
        ],
      },
    });

    if (overlap) {
      res.status(400);
      throw new Error('El alojamiento no está disponible en esas fechas.');
    }

    // Calcular precio total
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * parseFloat(listing.pricePerNight);

    const booking = await Booking.create({
      guestId: req.user.id,
      listingId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      notes,
    });

    res.status(201).json({
      message: 'Reserva creada correctamente',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Listing, as: 'listing' }],
    });

    if (!booking) {
      res.status(404);
      throw new Error('Reserva no encontrada.');
    }

    // Solo el anfitrión puede confirmar/cancelar
    if (booking.listing.hostId !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('No tienes permiso para modificar esta reserva.');
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: `Reserva ${status === 'confirmed' ? 'confirmada' : 'actualizada'} correctamente`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyBookings,
  getHostBookings,
  createBooking,
  updateBookingStatus,
};
