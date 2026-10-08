import React from "react";
import Image from "next/image";

export function MsbLogo({
  className = "h-14 w-auto",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "white";
}) {
  const src =
    variant === "white"
      ? "/images/logos/msb-crest-white.png"
      : "/images/logos/msb-crest.png";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt="MSB Haidery Crest"
        width={118}
        height={116}
        className="h-full w-auto object-contain drop-shadow-sm select-none"
        priority
      />
    </div>
  );
}

export function BhsLogo({
  className = "h-12 w-auto",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "white";
}) {
  const src =
    variant === "white"
      ? "/images/logos/bhs-logo-white.png"
      : "/images/logos/bhs-logo.png";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt="Badri High School Logo"
        width={182}
        height={96}
        className="h-full w-auto object-contain drop-shadow-sm select-none"
        priority
      />
    </div>
  );
}

export function SchoolDivider({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/images/logos/gold-divider.png"
        alt="Divider"
        width={24}
        height={100}
        className="h-full w-auto object-contain select-none"
        priority
      />
    </div>
  );
}

export function SchoolIdentityLockup({
  className = "h-16 md:h-20 lg:h-24 w-auto",
}: {
  className?: string;
}) {
  return (
    <div className="school-identity-lockup flex items-center justify-center transition-transform hover:scale-[1.02] duration-300">
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Image
          src="/images/logos/school-logos-lockup.png"
          alt="MSB Haidery & Badri High School"
          width={525}
          height={174}
          priority
          className="h-full w-auto object-contain drop-shadow-[0_2px_8px_rgba(15,41,82,0.12)] select-none"
        />
      </div>
    </div>
  );
}
