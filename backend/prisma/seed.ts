import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function upsertMarketItem(sellerId: number, title: string, description: string, price: number) {
  const existing = await prisma.marketItem.findFirst({
    where: { sellerId, title },
  });

  if (existing) {
    return prisma.marketItem.update({
      where: { id: existing.id },
      data: { description, price },
    });
  }

  return prisma.marketItem.create({
    data: { sellerId, title, description, price },
  });
}

async function upsertEvent(title: string, description: string, date: Date, location: string) {
  const existing = await prisma.event.findFirst({
    where: { title, location },
  });

  if (existing) {
    return prisma.event.update({
      where: { id: existing.id },
      data: { description, date },
    });
  }

  return prisma.event.create({
    data: { title, description, date, location },
  });
}

async function upsertThread(authorId: number, categoryId: number, title: string, content: string) {
  const existing = await prisma.thread.findFirst({
    where: { authorId, categoryId, title },
  });

  if (existing) {
    return prisma.thread.update({
      where: { id: existing.id },
      data: { content },
    });
  }

  return prisma.thread.create({
    data: { authorId, categoryId, title, content },
  });
}

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const categories = [
    { name: 'Candle Making', description: 'Wax, scent, and casting techniques for decorative candles.', icon: 'CM' },
    { name: 'Embroidery and Sewing', description: 'Fabric work, stitching patterns, and garment construction.', icon: 'ES' },
    { name: 'Leatherwork', description: 'Tooling, finishing, and care for leather goods.', icon: 'LW' },
    { name: 'Woodcarving', description: 'Hand carving, finishing, and carving tool advice.', icon: 'WC' },
    { name: 'Jewelry and Metalwork', description: 'Small metalsmithing, jewelry assembly, and finishing.', icon: 'JM' },
    { name: 'Knitting and Crochet', description: 'Patterns, yarn selection, and textile tips.', icon: 'KC' },
    { name: 'Bookbinding', description: 'Binding methods, materials, and restoration notes.', icon: 'BB' },
    { name: 'Painting and Illustration', description: 'Paint media, drafting, and illustration techniques.', icon: 'PI' },
    { name: 'Potions and Apothecary', description: 'Soap, dye, and herbal craft discussions.', icon: 'PA' },
    { name: 'Pottery and Ceramics', description: 'Clay bodies, glazing, kiln cycles, and shaping.', icon: 'PC' },
    { name: 'Paper Craft and Calligraphy', description: 'Paper work, lettering, seals, and presentation.', icon: 'PP' },
    { name: 'Blacksmithing', description: 'Forging, heat control, and shop practice.', icon: 'BS' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        icon: category.icon,
      },
      create: category,
    });
  }

  const artisan = await prisma.user.upsert({
    where: { email: 'artisan@crafters.guild' },
    update: {
      password: hashedPassword,
      username: 'NightWeaver',
      avatar: 'NW',
      signature: 'Making practical things well.',
      role: 'CREATOR',
    },
    create: {
      email: 'artisan@crafters.guild',
      username: 'NightWeaver',
      password: hashedPassword,
      role: 'CREATOR',
      avatar: 'NW',
      signature: 'Making practical things well.',
    },
  });

  await upsertMarketItem(artisan.id, 'Obsidian Flame Set', 'Three hand-poured candles with dark wax and long burn time.', 28);
  await upsertMarketItem(artisan.id, 'Victorian Mourning Sampler', 'Framed embroidery piece with a gothic floral pattern.', 65);
  await upsertMarketItem(artisan.id, 'Raven Tooled Journal Cover', 'Leather journal cover sized for an A5 notebook.', 42);

  await upsertEvent(
    'Monthly Craft Review',
    'Bring one finished project or work in progress for peer feedback.',
    new Date(Date.now() + 86400000 * 7),
    'The Inner Sanctum',
  );

  const candleCategory = await prisma.category.findUnique({
    where: { name: 'Candle Making' },
  });

  if (candleCategory) {
    const thread = await upsertThread(
      artisan.id,
      candleCategory.id,
      'Black Flame Techniques for Layered Candles',
      'Share your wax temperatures, dye ratios, and mold release tips for multi-layer candle pours.',
    );

    const existingPosts = await prisma.post.count({
      where: { threadId: thread.id },
    });

    if (existingPosts === 0) {
      await prisma.post.createMany({
        data: [
          { content: 'I have had the best results by lowering the pour temperature on the final layer.', threadId: thread.id, authorId: artisan.id },
          { content: 'A silicone mold helped me stop edge cracking on taller pillars.', threadId: thread.id, authorId: artisan.id },
        ],
      });
    }
  }

  console.log('Seed complete. Demo login: artisan@crafters.guild / password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
