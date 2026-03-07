import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { COOKIES } from "@/lib/auth/constants";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const submissionId = resolvedParams.id;

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value;
    const user = token ? await getUser(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { isPublic, publicDescription } = body;

    if (typeof isPublic !== "boolean") {
      return NextResponse.json({ error: "Invalid isPublic value" }, { status: 400 });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        isPublic,
        publicDescription: isPublic ? publicDescription : null
      },
    });

    return NextResponse.json({ data: updatedSubmission });
  } catch (error: any) {
    console.error("Error updating submission public status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
