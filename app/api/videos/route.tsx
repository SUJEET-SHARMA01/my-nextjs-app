import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";


const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching videos...");
    const videos = await prisma.video.findMany({
      orderBy: {  createAt : "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
