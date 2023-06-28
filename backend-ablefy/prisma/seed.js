
// const prisma = require("../prisma");

const { PrismaClient } = require("@prisma/client");
const faker = require("faker");

const prisma = new PrismaClient();

const dataNumbers = {
  songs: [6, 4, 5, 5, 3],
};

async function main() {
  console.log(`🌱 Start seeding ...`);

  try {
    for (const numberOfSongs of dataNumbers.songs) {
      console.log(`Start seeding `, numberOfSongs);
      const newArtist = await prisma.artist.create({
        data: {
          name: faker.name.firstName(),
        },
      });

      const newAlbum = await prisma.album.create({
        data: {
          title: faker.lorem.paragraph(),
          artist: { connect: { id: newArtist.id } },
        },
      });

      for (const item of [...Array(numberOfSongs)]) {
        await prisma.song.create({
          data: {
            title: faker.hacker.noun(),
            duration: faker.datatype.number(),
            playbacks: faker.datatype.number(),
            artist: { connect: { id: newArtist.id } },
            album: { connect: { id: newAlbum.id } },
          },
        });
      }
    }

    console.log("✅ Seeding success finished.");
  } catch (error) {
    console.error('🔴 Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

module.exports = main;
