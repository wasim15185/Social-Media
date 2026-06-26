import { prisma } from "../../config/prisma";

export const TrendingService = {
  async getTrendingHashtags(limit = 10, days = 2) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await prisma.$queryRaw<{ tag: string; count: bigint }[]>`
      SELECT lower(m[1]) as tag, count(*) as count
      FROM "Post", regexp_matches(content, '#(\w+)', 'g') as m
      WHERE "createdAt" >= ${since}
      GROUP BY tag
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return result.map((r) => ({
      tag: r.tag,
      count: Number(r.count),
    }));
  },
};
