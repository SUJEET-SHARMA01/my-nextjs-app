"use client";
import React, { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};
type socialFormats = keyof typeof socialFormats;

export default function page() {
  const [UploadedImage, setUploadedImage] = useState<string | null>(null);
  const [SelectFormat, setSelectFormat] = useState<socialFormats>(
    "Instagram Square (1:1)"
  );
  const [IsTrasforming, setIsTransfroming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (UploadedImage) {
      setIsTransfroming(true);
    }
  }, [setSelectFormat,UploadedImage]);

  const handleFileUpload=async (event:React.ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];
    if(!file) return ;
    setUploadedImage(file.name); // or use a URL if available
    const formdata=new FormData()
    formdata.append("file",file)
    try{
await fetch("/api/image-upload"),{
     
      }
    }
    catch(error)
    {

    };
    
  }

  return <div></div>;
}
