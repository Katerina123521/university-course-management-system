import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {

      const hash = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: {
          email,
          password: hash,
          name: email.split("@")[0],
        },
      });
    } else {
      
      if (!user.password) {
        return NextResponse.json(
          { error: "User has no password set" },
          { status: 400 }
        );
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    }

    
    return NextResponse.json({
      id: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error?.message || error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
