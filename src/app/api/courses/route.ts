import { NextResponse } from "next/server";
import { prisma } from "../../lib/db";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
   
    return NextResponse.json([], { status: 200 });
  }

  const courses = await prisma.course.findMany({
    where: { teacherId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}


export async function POST(req: Request) {
  try {
    const { title, description, userId } = await req.json();

    if (!userId || !title?.trim()) {
      return NextResponse.json(
        { error: "Missing userId or title" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        teacherId: userId,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const { id, title, description, userId } = await req.json();

    if (!id || !userId || !title?.trim()) {
      return NextResponse.json(
        { error: "Missing id, userId or title" },
        { status: 400 }
      );
    }

    const existing = await prisma.course.findFirst({
      where: { id, teacherId: userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Course not found or not yours" },
        { status: 404 }
      );
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE 
export async function DELETE(req: Request) {
  try {
    const { id, userId } = await req.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Missing id or userId" },
        { status: 400 }
      );
    }

    const existing = await prisma.course.findFirst({
      where: { id, teacherId: userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Course not found or not yours" },
        { status: 404 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
