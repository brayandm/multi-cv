import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { useState } from "react";
import { Application } from "@/lib/types";
import { useTranslations } from "next-intl";

interface FullApplicationModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
}

export function FullApplicationModal({
  application,
  isOpen,
  onClose,
}: FullApplicationModalProps) {
  const [comments, setComments] = useState(application.user_comments || "");

  const infoBlock = (label: string, value?: string | number | null) =>
    value ? (
      <div className="text-sm text-gray-800 dark:text-gray-200 mb-3">
        <span className="font-semibold">{label}:</span> {value}
      </div>
    ) : null;

  const tApplication = useTranslations(
    "pages.home.tabs.applications.application"
  );

  const t = useTranslations();

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {application.company_name || tApplication("company")}{" "}
              <span className="text-sm font-normal text-gray-500">
                {application.role || tApplication("no-role")}
              </span>
            </ModalHeader>

            <ModalBody className="space-y-3 ">
              <div className="overflow-scroll h-[60vh]">
                {infoBlock(
                  tApplication("website"),
                  application.company_website
                )}
                {infoBlock(tApplication("link"), application.job_post_link)}
                {infoBlock(tApplication("location"), application.location_type)}
                {infoBlock(
                  tApplication("place"),
                  application.country_or_region
                )}
                {infoBlock(tApplication("summary"), application.job_summary)}
                {application.job_bullets &&
                  application.job_bullets?.length > 0 && (
                    <div className="text-sm mb-3">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {tApplication("bullets")}:
                      </span>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                        {application.job_bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {infoBlock(
                  tApplication("date"),
                  new Date(application.application_date).toLocaleDateString()
                )}
                {infoBlock(tApplication("status"), application.status)}
                {infoBlock(
                  tApplication("recruiter"),
                  application.recruiter_name
                )}
                {infoBlock(tApplication("contact"), application.contact_email)}
                {infoBlock(tApplication("source"), application.job_post_source)}
                {infoBlock(tApplication("salary"), application.salary)}

                {application.skills && application.skills?.length > 0 && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {tApplication("skills")}:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {application.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Accordion variant="splitted">
                  <AccordionItem
                    key="1"
                    aria-label="Job Description Raw"
                    title={tApplication("job-description")}
                  >
                    <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                      {application.job_description_raw}
                    </div>
                  </AccordionItem>
                </Accordion>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {tApplication("notes")}
                  </label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={tApplication("notes_placeholder")}
                    minRows={3}
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("common.buttons.close")}
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                }}
              >
                {t("common.buttons.save")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
