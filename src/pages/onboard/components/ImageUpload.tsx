import { useState } from "react";
import { cn } from "~/lib/utils";
import Image from "next/image";

export default function ImageUpload() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const UploadIcon = () => (
    <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M37.6401 23.8799V29.7599H43.5201V33.6799H37.6401V39.5599H33.7201V33.6799H27.8401V29.7599H33.7201V23.8799H37.6401ZM37.6558 0.359863C38.7299 0.359863 39.6001 1.23206 39.6001 2.30614V19.9599H35.6801V4.27986H4.32015V31.7179L23.9201 12.1199L29.8001 17.9999V23.5447L23.9201 17.6647L9.86107 31.7199H23.9201V35.6399H2.34447C1.82862 35.6393 1.33408 35.4341 0.969506 35.0691C0.604931 34.7042 0.400146 34.2094 0.400146 33.6936V2.30614C0.403733 1.7914 0.609671 1.29874 0.973472 0.93457C1.33727 0.570402 1.82973 0.363969 2.34447 0.359863H37.6558ZM12.1601 8.19986C13.1998 8.19986 14.1969 8.61286 14.932 9.348C15.6671 10.0831 16.0801 11.0802 16.0801 12.1199C16.0801 13.1595 15.6671 14.1566 14.932 14.8917C14.1969 15.6269 13.1998 16.0399 12.1601 16.0399C11.1205 16.0399 10.1234 15.6269 9.38829 14.8917C8.65314 14.1566 8.24015 13.1595 8.24015 12.1199C8.24015 11.0802 8.65314 10.0831 9.38829 9.348C10.1234 8.61286 11.1205 8.19986 12.1601 8.19986V8.19986Z" fill="white"/>
    </svg>
  );
  const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setImageSrc(reader.result as string | null);
      };
  
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setImageSrc(null);
      }
    }
  };

  return (
    <div className={cn("w-[112px] h-[112px] bg-secondary rounded-full flex justify-center items-center overflow-clip")}>
      <input id="fileInput" type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />
      <label htmlFor="fileInput" className={cn("bg-secondary rounded-full")}>
        {imageSrc ? <Image src={imageSrc} width={112} height={112} alt="Uploaded content" /> : <UploadIcon />}
      </label>
    </div>
  )
}

