"use client";

import DefaultTemplate from "@/templates/default";
import { Button } from "@heroui/react";

export default function EditCvComponent() {
  return (
    <>
      <div className="flex justify-center items-center mb-3">
        <Button className="" color="primary" onPress={() => {}}>
          Download CV
        </Button>
      </div>
      <DefaultTemplate />
    </>
  );
}
