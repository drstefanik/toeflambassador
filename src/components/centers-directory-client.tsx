"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { CentersDirectory } from "./centers-directory";

const CentersDirectoryLazy = dynamic(
  () => import("./centers-directory").then((mod) => mod.CentersDirectory),
  { ssr: false }
);

export function CentersDirectoryClient(props: ComponentProps<typeof CentersDirectory>) {
  return <CentersDirectoryLazy {...props} />;
}
