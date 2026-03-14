import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import * as bcrypt from 'bcrypt';

const adapter = new PrismaBetterSqlite3({
    url: "C:\\Users\\Inna\\Desktop\\guid-forum-market-platform-1\\backend\\dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Cleaning up database...');
    await prisma.post.deleteMany();
    await prisma.thread.deleteMany();
    await prisma.marketItem.deleteMany();
    await prisma.event.deleteMany();
    // We keep Categories and Users and upsert them
    const categories = [
        { name: 'Candle Making', description: 'Black flames, carved pillars, scented shadows. Master the art of wax and wick.', icon: '🕯️' },
        { name: 'Embroidery & Sewing', description: 'From mourning samplers to darkly elegant garments. Thread, needle, and patience.', icon: '🧵' },
        { name: 'Leatherwork', description: 'Tooled journals, belts, and armor. The scent of leather and the press of the stamp.', icon: '🔨' },
        { name: 'Woodcarving', description: 'Gargoyles, rune boxes, walking staves. Shape the grain into something haunting.', icon: '🪵' },
        { name: 'Jewelry & Metalwork', description: 'Silver serpents, obsidian pendants, wire-wrapped talismans. Forge your darkness in metal.', icon: '💎' },
        { name: 'Knitting & Crochet', description: 'Skull motifs, black lace shawls, and hooded cloaks. Yarn twisted into dark elegance.', icon: '🧶' },
        { name: 'Bookbinding', description: 'Grimoires, leather journals, and gilded pages. Bind your knowledge in proper form.', icon: '📚' },
        { name: 'Painting & Illustration', description: 'Dark oil paintings, tarot illustrations, and macabre portraits. Canvas and pigment.', icon: '🎨' },
        { name: 'Potions & Apothecary', description: 'Herbal salves, ink recipes, natural dyes. The craft of concoction and preservation.', icon: '🧪' },
        { name: 'Pottery & Ceramics', description: 'Goblets, incense holders, and gargoyle figurines. Earth shaped by fire and intention.', icon: '🏺' },
        { name: 'Paper Craft & Calligraphy', description: 'Gothic lettering, wax seals, and paper sculptures. The elegance of parchment.', icon: '✂️' },
        { name: 'Blacksmithing', description: 'Forged blades, iron candelabras, and wrought gates. The anvil sings at midnight.', icon: '🗡️' },
    ];

    console.log('Seeding categories...');
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }

    console.log('Seeding artisan...');
    const artisan = await prisma.user.upsert({
        where: { email: 'artisan@obsidian.loom' },
        update: {
            password: hashedPassword,
            username: 'NightWeaver',
            avatar: '🦇',
            signature: 'Master of the Flame',
            role: 'CREATOR',
        },
        create: {
            email: 'artisan@obsidian.loom',
            username: 'NightWeaver',
            password: hashedPassword,
            role: 'CREATOR',
            avatar: '🦇',
            signature: 'Master of the Flame',
        },
    });

    console.log('Seeding market items...');
    const marketItems = [
        { title: 'Obsidian Flame Set', description: '3 Hand-poured Gothic Candles', price: 28, sellerId: artisan.id },
        { title: 'Victorian Mourning Sampler', description: 'Framed Original Embroidery', price: 65, sellerId: artisan.id },
        { title: 'Gothic Raven Tooled Grimoire', description: 'A5 Leather Cover', price: 42, sellerId: artisan.id },
    ];
    for (const item of marketItems) {
        await prisma.marketItem.create({ data: item });
    }

    console.log('Seeding events...');
    await prisma.event.create({
        data: {
            title: 'Midnight Crafting Ritual',
            description: 'Join us under the new moon for a session of wax carving.',
            date: new Date(Date.now() + 86400000 * 7),
            location: 'The Inner Sanctum',
        }
    });

    console.log('Seeding threads & posts...');
    const candleCat = await prisma.category.findUnique({ where: { name: 'Candle Making' } });
    if (candleCat) {
        const thread = await prisma.thread.create({
            data: {
                title: 'Black Flame Techniques — Achieving the Perfect Gothic Candle',
                content: 'Fellow artisans of the flame...',
                categoryId: candleCat.id,
                authorId: artisan.id,
            }
        });

        await prisma.post.createMany({
            data: [
                { content: 'This is exactly what I\'ve been trying to achieve!', threadId: thread.id, authorId: artisan.id },
                { content: 'Incredible work, NightWeaver.', threadId: thread.id, authorId: artisan.id },
            ]
        });
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
