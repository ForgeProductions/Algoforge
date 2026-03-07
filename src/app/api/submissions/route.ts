import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { COOKIES } from "@/lib/auth/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return NextResponse.json({ error: "Missing problemId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value;
    const user = token ? await getUser(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        userId: user.id,
        problemId: problemId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: submissions });
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
