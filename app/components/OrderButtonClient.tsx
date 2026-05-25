"use client";
import dynamic from "next/dynamic";

const OrderButton = dynamic(() => import("./OrderButton"), { ssr: false });

export default function OrderButtonClient() {
  return <OrderButton />;
}
