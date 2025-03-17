"use client";

import { fetcherApi, generateCvInlineEngine } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";

import useSWR from "swr";
// import CvList from "../../shared/components/CvList";
// import { CV } from "@/lib/types";
import { Button } from "@heroui/react";

export default function HomeComponent() {
  const { isLoading: isUserDataLoading } = useSWR(userApiLink, fetcherApi);

  if (isUserDataLoading) {
    return null;
  }

  // const cvs: CV[] = [
  //   {
  //     company: "Revolut",
  //     id: 1,
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlgyWdHZSOZRBvuW1beyMAUAkMCzgmT6lalg&s",
  //     pdf_file: "revolut_9139j.pdf",
  //     role: "Backend Senior Developer",
  //     job_description:
  //       "They're looking for a senior PYTHON developer to work in a new Revolut service called RevoCraft.",
  //     days_to_expire: 15,
  //   },
  //   {
  //     company: "Manychat",
  //     id: 2,
  //     pdf_file: "manychat_899zs.pdf",
  //     image:
  //       "https://wpforms.com/wp-content/uploads/cache/integrations/11feaa2e60afe044c942216f1600ee9f.png",
  //     job_description:
  //       "Seeking a skilled Data Analyst to process, interpret, and visualize key data insights to enhance chatbot performance and user engagement.",
  //     role: "Data Analyst",
  //     days_to_expire: 10,
  //   },
  //   {
  //     company: "Manychat",
  //     id: 3,
  //     pdf_file: "manychat_829zs.pdf",
  //     image:
  //       "https://wpforms.com/wp-content/uploads/cache/integrations/11feaa2e60afe044c942216f1600ee9f.png",
  //     job_description:
  //       "Looking for a Frontend Developer to craft seamless user experiences, optimize UI performance, and enhance Manychat's automation platform.",
  //     role: "Frontend Developer",
  //     days_to_expire: 8,
  //   },
  // ];

  return (
    <main className="">
      <div className="flex justify-center">
        {/* <CvList cvs={cvs}></CvList> */}
        <Button
          color="primary"
          onPress={() => {
            generateCvInlineEngine();
          }}
        >
          Generate CV
        </Button>
      </div>
    </main>
  );
}
