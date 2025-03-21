"use client";

import {
  fetcherApi,
  generateCvInlineEngine,
  getQuotaInfoApi,
} from "@/lib/backendService";
import { userApiLink } from "@/lib/links";
import { saveAs } from "file-saver";

import useSWR from "swr";
// import CvList from "../../shared/components/CvList";
// import { CV } from "@/lib/types";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { GetQuotaInfoResponse } from "@/lib/types";
import { AxiosResponse } from "axios";

export default function HomeComponent() {
  const { isLoading: isUserDataLoading } = useSWR(userApiLink, fetcherApi);

  const [isQuotaInfoLoading, setIsQuotaInfoLoading] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<GetQuotaInfoResponse | null>(null);

  const getQuota = () => {
    getQuotaInfoApi("generate_cv_inline")
      .then((response: AxiosResponse<GetQuotaInfoResponse>) => {
        setQuotaInfo(response.data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error while fetching quota info", error.message);
        } else {
          console.error("Error while fetching quota info", error);
        }
      })
      .finally(() => {
        setIsQuotaInfoLoading(false);
      });
  };

  useEffect(() => {
    getQuota();
  }, []);

  const [isCvLoading, setIsCvLoading] = useState(false);

  if (isUserDataLoading || isQuotaInfoLoading) {
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

  const handleDownload = async () => {
    try {
      setIsCvLoading(true);
      const response = await generateCvInlineEngine();

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      saveAs(blob, "cv.pdf");
    } catch (error) {
      console.error("Error while generating CV", error);
    }
    setIsCvLoading(false);
    getQuota();
  };

  return (
    <main className="">
      <div className="flex justify-center">
        {/* <CvList cvs={cvs}></CvList> */}
      </div>
      <div className="flex justify-center">
        <Button
          color="primary"
          onPress={handleDownload}
          isDisabled={isCvLoading || quotaInfo?.left === 0}
          isLoading={isCvLoading}
        >
          Generate CV
        </Button>
      </div>
      {quotaInfo && (
        <div className="mt-4 text-center">
          <p>
            <strong>Quota Info:</strong>
          </p>
          <p>
            Used: {quotaInfo.left} / {quotaInfo.quota}
          </p>
        </div>
      )}
    </main>
  );
}
