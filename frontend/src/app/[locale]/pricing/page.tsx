"use client";

import PricingComponent from "@/components/PricingComponent";
import { useEffect, useState } from "react";

export default function Pricing() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(Math.random());
  }, []);

  return (
    <div key={key}>
      <PricingComponent />
    </div>
  );
}
