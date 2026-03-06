import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
        return NextResponse.json([]);
    }

    const problems = await prisma.problem.findMany({
        where: {
            isPublished: true,
            OR: [
                { title: { contains: q } },
                { tags: { contains: q } },
            ]
        },
        select: {
            title: true,
            slug: true,
            difficulty: true,
            tags: true,
            platformSource: true,
        },
        take: 8,
        orderBy: { title: "asc" },
    });

    return NextResponse.json(problems);
}
