"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function CoverImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  const { alt, ...imageProps } = props;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} unavailable`}
        className="absolute inset-0 grid place-items-center bg-[#EEF2F7] p-4 text-center"
      >
        <span className="font-mono text-xs font-semibold tracking-wider text-[#475569]">
          COVER IMAGE UNAVAILABLE
        </span>
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      alt={alt}
      onError={(event) => {
        console.error("Cover image failed to load", event.currentTarget.currentSrc);
        setFailed(true);
      }}
    />
  );
}
