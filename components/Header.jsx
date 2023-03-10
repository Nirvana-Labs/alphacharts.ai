import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className=" w-full py-4">
      <div>
        <Link href={"/"}>
          <h1 className="text-2xl font-fira font-extrabold ml-4">
            alphacharts.ai
          </h1>
        </Link>
      </div>
    </div>
  );
}
