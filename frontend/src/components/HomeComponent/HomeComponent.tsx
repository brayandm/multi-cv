"use client";

import {
  fetcherApi,
  generateCvInlineEngine,
  generateCvInlineNoRenderEngine,
  getQuotaInfoApi,
} from "@/lib/backendService";
import { userApiLink } from "@/lib/links";

import useSWR from "swr";
// import CvList from "../../shared/components/CvList";
// import { CV } from "@/lib/types";
import { Button, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { GetQuotaInfoResponse } from "@/lib/types";
import { AxiosResponse } from "axios";
import { useTranslations } from "next-intl";
import { useLocale } from "@/contexts/LocaleContext";
import { useCv } from "@/contexts/CvContext";
import { useRouter } from "next/navigation";

import { saveAs } from "file-saver";

export default function HomeComponent() {
  const { isLoading: isUserDataLoading } = useSWR(userApiLink, fetcherApi);

  const { getTraduction } = useLocale();

  const { setCv } = useCv();

  const router = useRouter();

  const [isQuotaInfoLoading, setIsQuotaInfoLoading] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<GetQuotaInfoResponse | null>(null);

  const t = useTranslations();

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

  const handleDocument = async (download = false) => {
    try {
      setIsCvLoading(true);
      const response = await generateCvInlineEngine(getTraduction());

      const blob = new Blob([response.data], { type: "application/pdf" });

      if (download) {
        const contentDisposition = response.headers["content-disposition"];
        let filename = "cv.pdf";

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        saveAs(blob, filename);
      } else {
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");
      }
    } catch (error) {
      console.error("Error while generating CV", error);
    }

    setIsCvLoading(false);
    getQuota();
  };

  const redirectEditCv = async () => {
    try {
      setIsCvLoading(true);
      const response = await generateCvInlineNoRenderEngine(getTraduction());
      if (response.data) setCv(response.data);

      router.push("/edit/cv");
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
      {quotaInfo ? (
        <>
          <div className="flex justify-center">
            <Button
              color="primary"
              onPress={() => (true ? handleDocument() : redirectEditCv())}
              isDisabled={isCvLoading || quotaInfo?.left === 0}
              isLoading={isCvLoading}
            >
              {t("common.texts.generate_cv")}
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p>
              <strong>{t("common.texts.quota_info")}:</strong>
            </p>
            <p>
              {t("common.texts.used")}: {quotaInfo.left} / {quotaInfo.quota}
            </p>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <Spinner variant="dots" />
        </div>
      )}
    </main>
  );
}
