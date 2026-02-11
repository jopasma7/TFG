require('dotenv').config();

const { User, Listing, Booking, Review, syncDatabase } = require('./models');

const seedData = async () => {
  try {
    // Reiniciar tablas (borra todo y recrea)
    await syncDatabase();
    console.log('🗑️  Limpiando datos anteriores...');
    await Review.destroy({ where: {} });
    await Booking.destroy({ where: {} });
    await Listing.destroy({ where: {} });
    await User.destroy({ where: {} });

    // ========================
    // USUARIOS
    // ========================
    console.log('👤 Creando usuarios...');
    const users = await User.bulkCreate([
      {
        name: 'Alejandro García',
        email: 'alex@test.com',
        password: '123456',
        role: 'host',
        phone: '+34 612 345 678',
        bio: 'Amante de los viajes y anfitrión en Madrid. Me encanta recibir viajeros de todo el mundo.',
      },
      {
        name: 'María López',
        email: 'maria@test.com',
        password: '123456',
        role: 'host',
        phone: '+34 623 456 789',
        bio: 'Propietaria de varios apartamentos en Barcelona. Ofrezco estancias únicas cerca de la playa.',
      },
      {
        name: 'Carlos Ruiz',
        email: 'carlos@test.com',
        password: '123456',
        role: 'host',
        phone: '+34 634 567 890',
        bio: 'Vivo en Sevilla y tengo casas rurales en Andalucía. Naturaleza y tranquilidad garantizadas.',
      },
      {
        name: 'Laura Martínez',
        email: 'laura@test.com',
        password: '123456',
        role: 'guest',
        phone: '+34 645 678 901',
        bio: 'Viajera frecuente. Me encanta descubrir nuevos lugares y compartir experiencias.',
      },
      {
        name: 'Pablo Sánchez',
        email: 'pablo@test.com',
        password: '123456',
        role: 'guest',
        phone: '+34 656 789 012',
        bio: 'Nómada digital. Trabajo remoto y viajo por España.',
      },
      {
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        bio: 'Administrador de la plataforma.',
      },
    ], { individualHooks: true }); // individualHooks para que hashee las contraseñas

    console.log(`   ✅ ${users.length} usuarios creados`);

    // ========================
    // ALOJAMIENTOS
    // ========================
    console.log('🏠 Creando alojamientos...');
    const listings = await Listing.bulkCreate([
      // --- Alojamientos de Alejandro (users[0]) ---
      {
        hostId: users[0].id,
        title: 'Apartamento luminoso en el centro de Madrid',
        description: 'Precioso apartamento reformado en pleno centro de Madrid, a 5 minutos de la Puerta del Sol. Perfecto para parejas o viajeros que quieran explorar la capital. Cuenta con wifi de alta velocidad, aire acondicionado y cocina totalmente equipada.',
        type: 'apartment',
        pricePerNight: 85,
        location: 'Calle Gran Vía 25, 3ºA',
        city: 'Madrid',
        country: 'España',
        latitude: 40.4200,
        longitude: -3.7025,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['wifi', 'aire acondicionado', 'cocina', 'ascensor', 'calefacción'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        ],
      },
      {
        hostId: users[0].id,
        title: 'Ático con terraza y vistas a Madrid',
        description: 'Espectacular ático con terraza privada de 30m² con vistas panorámicas a la ciudad. Ubicado en el barrio de Salamanca, zona exclusiva con restaurantes y tiendas a pie de calle. Ideal para una escapada romántica.',
        type: 'apartment',
        pricePerNight: 150,
        location: 'Calle Serrano 88, Ático',
        city: 'Madrid',
        country: 'España',
        latitude: 40.4350,
        longitude: -3.6850,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['wifi', 'terraza', 'aire acondicionado', 'vistas', 'parking'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        ],
      },

      // --- Alojamientos de María (users[1]) ---
      {
        hostId: users[1].id,
        title: 'Piso junto a la Barceloneta',
        description: 'Apartamento acogedor a solo 2 minutos andando de la playa de la Barceloneta. Recientemente reformado con decoración moderna. Dispone de balcón con vistas parciales al mar. Perfecto para unas vacaciones de sol y playa.',
        type: 'apartment',
        pricePerNight: 110,
        location: 'Passeig de Joan de Borbó 45',
        city: 'Barcelona',
        country: 'España',
        latitude: 41.3783,
        longitude: 2.1899,
        maxGuests: 5,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['wifi', 'playa cercana', 'balcón', 'aire acondicionado', 'lavadora'],
        images: [
          'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
        ],
      },
      {
        hostId: users[1].id,
        title: 'Loft de diseño en el Born',
        description: 'Loft de autor en el corazón del Born, el barrio más trendy de Barcelona. Espacio diáfano de 60m² con techos altos, ladrillo visto y mobiliario de diseño. A 5 minutos del Parque de la Ciutadella.',
        type: 'room',
        pricePerNight: 95,
        location: 'Carrer del Rec 32',
        city: 'Barcelona',
        country: 'España',
        latitude: 41.3851,
        longitude: 2.1834,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['wifi', 'diseño', 'cocina', 'bicicletas', 'aire acondicionado'],
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
        ],
      },
      {
        hostId: users[1].id,
        title: 'Villa con piscina en Sitges',
        description: 'Magnífica villa con piscina privada y jardín en Sitges, a 15 minutos de la playa. Casa de 180m² con 4 habitaciones, perfecta para familias o grupos de amigos. Barbacoa, hamacas y zona chill-out exterior.',
        type: 'house',
        pricePerNight: 250,
        location: 'Carrer de les Parellades 12',
        city: 'Sitges',
        country: 'España',
        latitude: 41.2371,
        longitude: 1.8120,
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['wifi', 'piscina', 'jardín', 'barbacoa', 'parking', 'aire acondicionado'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        ],
      },

      // --- Alojamientos de Carlos (users[2]) ---
      {
        hostId: users[2].id,
        title: 'Casa rural en la Sierra de Aracena',
        description: 'Encantadora casa rural rodeada de naturaleza en plena Sierra de Aracena. Perfecta para desconectar del estrés de la ciudad. Chimenea, patio andaluz y rutas de senderismo desde la puerta.',
        type: 'house',
        pricePerNight: 70,
        location: 'Camino de la Sierra s/n',
        city: 'Aracena',
        country: 'España',
        latitude: 37.8936,
        longitude: -6.5614,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['wifi', 'chimenea', 'jardín', 'senderismo', 'parking', 'mascotas'],
        images: [
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
        ],
      },
      {
        hostId: users[2].id,
        title: 'Apartamento en el centro de Sevilla',
        description: 'Bonito apartamento junto a la Catedral de Sevilla y la Giralda. Decoración típica andaluza con azulejos y patio interior. Ideal para conocer Sevilla a pie: tapas, flamenco y monumentos.',
        type: 'apartment',
        pricePerNight: 90,
        location: 'Calle Mateos Gago 8, 2ºB',
        city: 'Sevilla',
        country: 'España',
        latitude: 37.3861,
        longitude: -5.9925,
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['wifi', 'aire acondicionado', 'cocina', 'patio', 'centro histórico'],
        images: [
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
        ],
      },
      {
        hostId: users[2].id,
        title: 'Cabaña con encanto en Grazalema',
        description: 'Cabaña de madera acogedora en el Parque Natural de la Sierra de Grazalema. Rodeada de bosques, con vistas a la montaña. Perfecta para parejas aventureras o amantes de la naturaleza. Incluye desayuno artesanal.',
        type: 'house',
        pricePerNight: 65,
        location: 'Parque Natural Sierra de Grazalema',
        city: 'Grazalema',
        country: 'España',
        latitude: 36.7619,
        longitude: -5.3678,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['chimenea', 'vistas montaña', 'senderismo', 'desayuno incluido', 'parking'],
        images: [
          'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop',
        ],
      },
    ]);

    console.log(`   ✅ ${listings.length} alojamientos creados`);

    // ========================
    // RESERVAS
    // ========================
    console.log('📅 Creando reservas...');
    const bookings = await Booking.bulkCreate([
      {
        guestId: users[3].id, // Laura
        listingId: listings[0].id, // Madrid centro
        checkIn: '2026-03-15',
        checkOut: '2026-03-20',
        guests: 2,
        totalPrice: 85 * 5,
        status: 'confirmed',
      },
      {
        guestId: users[4].id, // Pablo
        listingId: listings[2].id, // Barceloneta
        checkIn: '2026-04-01',
        checkOut: '2026-04-07',
        guests: 3,
        totalPrice: 110 * 6,
        status: 'confirmed',
      },
      {
        guestId: users[3].id, // Laura
        listingId: listings[5].id, // Aracena
        checkIn: '2026-05-10',
        checkOut: '2026-05-13',
        guests: 4,
        totalPrice: 70 * 3,
        status: 'pending',
      },
      {
        guestId: users[4].id, // Pablo
        listingId: listings[6].id, // Sevilla
        checkIn: '2026-02-20',
        checkOut: '2026-02-23',
        guests: 1,
        totalPrice: 90 * 3,
        status: 'completed',
      },
      {
        guestId: users[3].id, // Laura
        listingId: listings[4].id, // Villa Sitges
        checkIn: '2026-07-01',
        checkOut: '2026-07-08',
        guests: 6,
        totalPrice: 250 * 7,
        status: 'pending',
      },
    ]);

    console.log(`   ✅ ${bookings.length} reservas creadas`);

    // ========================
    // RESEÑAS
    // ========================
    console.log('⭐ Creando reseñas...');
    const reviews = await Review.bulkCreate([
      {
        userId: users[3].id, // Laura
        listingId: listings[0].id, // Madrid centro
        rating: 5,
        comment: '¡Increíble! El apartamento es exactamente como en las fotos. Super céntrico, limpio y con todo lo necesario. Alejandro fue muy atento. Repetiré seguro.',
      },
      {
        userId: users[4].id, // Pablo
        listingId: listings[0].id, // Madrid centro
        rating: 4,
        comment: 'Muy buena ubicación y el piso estaba impecable. Le pongo un 4 porque la calle es algo ruidosa por la noche, pero por lo demás perfecto.',
      },
      {
        userId: users[4].id, // Pablo
        listingId: listings[2].id, // Barceloneta
        rating: 5,
        comment: 'Estar a 2 minutos de la playa no tiene precio. El apartamento tiene todo lo que necesitas. María nos dejó recomendaciones de restaurantes geniales.',
      },
      {
        userId: users[3].id, // Laura
        listingId: listings[3].id, // Born
        rating: 4,
        comment: 'El loft es precioso, muy instagrameable. El barrio del Born es genial para salir. Solo echo en falta un poco más de espacio de armario.',
      },
      {
        userId: users[4].id, // Pablo
        listingId: listings[6].id, // Sevilla
        rating: 5,
        comment: 'Ubicación perfecta para conocer Sevilla. Sales a la puerta y tienes la Catedral delante. Carlos fue un anfitrión 10, nos recomendó las mejores tabernas.',
      },
      {
        userId: users[3].id, // Laura
        listingId: listings[5].id, // Aracena
        rating: 5,
        comment: 'Una experiencia increíble. La casa es preciosa y está rodeada de naturaleza. Hicimos rutas de senderismo espectaculares. La chimenea por la noche es un lujo.',
      },
      {
        userId: users[4].id, // Pablo
        listingId: listings[7].id, // Grazalema
        rating: 5,
        comment: 'La cabaña es un sueño. Desconectar de verdad en plena naturaleza. El desayuno artesanal que incluye Carlos es una pasada. Volveré.',
      },
    ]);

    console.log(`   ✅ ${reviews.length} reseñas creadas`);

    // Actualizar medias de los alojamientos con reseñas
    console.log('📊 Actualizando valoraciones medias...');
    for (const listing of listings) {
      const listingReviews = await Review.findAll({ where: { listingId: listing.id } });
      if (listingReviews.length > 0) {
        const avg = listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length;
        await listing.update({
          averageRating: avg.toFixed(1),
          totalReviews: listingReviews.length,
        });
      }
    }

    console.log('\n🎉 ¡Seed completado con éxito!');
    console.log('================================');
    console.log(`   👤 ${users.length} usuarios`);
    console.log(`   🏠 ${listings.length} alojamientos`);
    console.log(`   📅 ${bookings.length} reservas`);
    console.log(`   ⭐ ${reviews.length} reseñas`);
    console.log('================================');
    console.log('\nCuentas de prueba:');
    console.log('  📧 alex@test.com    / 123456  (host)');
    console.log('  📧 maria@test.com   / 123456  (host)');
    console.log('  📧 carlos@test.com  / 123456  (host)');
    console.log('  📧 laura@test.com   / 123456  (guest)');
    console.log('  📧 pablo@test.com   / 123456  (guest)');
    console.log('  📧 admin@test.com   / admin123 (admin)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
