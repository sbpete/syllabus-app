"use client";

import ImageUpload from "../components/ImageUpload";
import React from "react";
import LoginButton from "../components/LoginButton";

export default function Home() {
  return (
    <div className="w-full flex flex-col px-8 justify-start items-center gap-4 min-h-[70vh]">
      <LoginButton />
      <ImageUpload />
    </div>
  );
}
