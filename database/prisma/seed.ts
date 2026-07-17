import { PrismaClient, Role, BookingStatus } from '@prisma/client';
import { fakerVI as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Landlords...');
  const landlords = [];
  for (let i = 0; i < 100; i++) {
    landlords.push({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(), // In a real app, this should be hashed
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      role: Role.LANDLORD,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  await prisma.user.createMany({ data: landlords });

  console.log('Seeding Users (Guests)...');
  const guests = [];
  for (let i = 0; i < 200; i++) {
    guests.push({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      role: Role.GUEST,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  await prisma.user.createMany({ data: guests });

  console.log('Seeding Rooms...');
  const rooms = [];
  const amenitiesList = ['WiFi', 'Điều hòa', 'Máy giặt', 'Bếp', 'Ban công', 'Chỗ để xe', 'Tủ lạnh', 'Thang máy'];
  for (let i = 0; i < 1000; i++) {
    const landlord = faker.helpers.arrayElement(landlords);
    rooms.push({
      id: faker.string.uuid(),
      landlordId: landlord.id,
      title: `Phòng trọ ${faker.commerce.productAdjective()} tại ${faker.location.city()}`,
      description: faker.lorem.paragraphs(2),
      price: parseFloat(faker.finance.amount({ min: 1000000, max: 10000000, dec: 0 })),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      district: faker.location.county(),
      amenities: faker.helpers.arrayElements(amenitiesList, { min: 2, max: 6 }),
      images: [
        faker.image.urlLoremFlickr({ category: 'apartment' }),
        faker.image.urlLoremFlickr({ category: 'room' })
      ],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  // Prisma chunking might be needed if payload is too large, but 1000 is usually fine
  await prisma.room.createMany({ data: rooms });

  console.log('Seeding Bookings...');
  const bookings = [];
  for (let i = 0; i < 300; i++) {
    const guest = faker.helpers.arrayElement(guests);
    const room = faker.helpers.arrayElement(rooms);
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + faker.number.int({ min: 1, max: 12 }));

    bookings.push({
      id: faker.string.uuid(),
      userId: guest.id,
      roomId: room.id,
      startDate: startDate,
      endDate: endDate,
      totalPrice: room.price * faker.number.int({ min: 1, max: 12 }),
      status: faker.helpers.arrayElement([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED]),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  await prisma.booking.createMany({ data: bookings });

  console.log('Seeding Reviews...');
  const reviews = [];
  for (let i = 0; i < 500; i++) {
    const guest = faker.helpers.arrayElement(guests);
    const room = faker.helpers.arrayElement(rooms);
    reviews.push({
      id: faker.string.uuid(),
      userId: guest.id,
      roomId: room.id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(2),
      createdAt: faker.date.past(),
    });
  }
  await prisma.review.createMany({ data: reviews });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
