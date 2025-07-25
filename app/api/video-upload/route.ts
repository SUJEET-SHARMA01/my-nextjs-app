import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { resolve } from "path";
import { rejects } from "assert";
import { Public } from "@prisma/client/runtime/library";
import { Prisma, PrismaClient } from "@prisma/client";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINATY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface cloudinaryUploadedResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINATY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not found" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title=formData.get("title") as string;
    const description=formData.get("description") as string;


    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await new Promise<cloudinaryUploadedResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { 
                folder: "video-uploads" ,
                resource_type:"video",
                transformation:[
                    {quality:"auto",fetch_format:"mp4"}
                ]

            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as cloudinaryUploadedResult);
              }
            }
          )
          .end(buffer);
      }
    );
   const video = await prisma.video.create({
     data: {
       title,
       description,
       publicId: result.public_id,
       bytes: String(result.bytes),
       duration: result.duration || 0,
     },
   });
   return NextResponse.json(video)
  } catch (error) {
    console.log("Upload video failed", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  }
  finally{
    await prisma.$disconnect();
  }
}
