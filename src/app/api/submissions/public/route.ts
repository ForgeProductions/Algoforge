import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return NextResponse.json({ error: "Missing problemId" }, { status: 400 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        problemId: problemId,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: submissions });
  } catch (error: any) {
    console.error("Error fetching public submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
