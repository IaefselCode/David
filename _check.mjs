import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const skills = await p.skill.findMany({ orderBy: { sort: 'asc' } });
for (const s of skills) console.log(s.id, s.name, s.icon);
await p.$disconnect();
