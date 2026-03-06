import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/cache/redis";
import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const track = searchParams.get("track");
    const topicId = searchParams.get("topicId");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

    // Build filter hash for caching
    const filterHash = Buffer.from(
      JSON.stringify({ track, topicId, difficulty, search, page, limit })
    ).toString("base64url");
    const cacheKey = CACHE_KEYS.problemList(filterHash);

    // Try cache
    const cached = await cacheGet(cacheKey);
    if (cached) return successResponse(cached);

    // Build where clause
    const where: Record<string, unknown> = { isPublished: true };
    if (track) where.trackType = track;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          tags: true,
          trackType: true,
          acceptanceRate: true,
          totalSubmissions: true,
          totalSolved: true,
          topicId: true,
          rating: true,
          order: true,
        },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    const data = {
      problems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await cacheSet(cacheKey, data, CACHE_TTL.problemList);
    return successResponse(data);
  } catch (error) {
    logger.error("Failed to list problems", error);
    return errorResponse("INTERNAL_ERROR", "Failed to list problems", 500);
  }
}
