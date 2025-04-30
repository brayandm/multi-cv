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
  SelectItem,
  Select,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  Application,
  ApplicationResponse,
  ApplicationStatusType,
  Document,
} from "@/lib/types";
import { useTranslations } from "next-intl";
import {
  statusOptions,
  statusToClass,
} from "../ApplicationsComponent/ApplicationsComponent";
import { MAX_LONG_TEXT_LENGTH } from "@/lib/consts";
import { fetcherEngine, updateApplicationEngine } from "@/lib/backendService";
import { applicationEngineLink } from "@/lib/links";
import useSWR from "swr";
import DocumentComponent from "@/shared/components/DocumentComponent";
import { capitalizeWords } from "@/lib/strings";

interface FullApplicationModalProps {
  application_id: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: ApplicationStatusType) => void;
  status: ApplicationStatusType;
}

export default function FullApplicationComponent({
  application_id,
  isOpen,
  onClose,
  onStatusChange,
  status,
}: FullApplicationModalProps) {
  const { data: applicationResponse, isLoading } = useSWR<ApplicationResponse>(
    applicationEngineLink + "?application_id=" + application_id,
    fetcherEngine
  );

  const [application, setApplication] = useState<Application | null>();

  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (applicationResponse) {
      setApplication(applicationResponse.application);
      setDocuments(applicationResponse.documents);
    }
  }, [applicationResponse]);

  const [comments, setComments] = useState(application?.user_comments || "");

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

  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const saveApplication = () => {
    if (!applicationResponse) return;
    if (!application) return;
    const updatedApplication = application;
    updatedApplication.user_comments = comments;
    setApplication(updatedApplication);
    updateApplicationEngine(updatedApplication);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
        <ModalContent>
          {() => (
            <>
              {isLoading || !application ? (
                <ModalBody className="space-y-3 ">
                  <div className="flex justify-center items-center h-64">
                    <Spinner />
                  </div>
                </ModalBody>
              ) : (
                <>
                  <ModalHeader>
                    <div className="pt-5 flex flex-row gap-1 justify-between w-full">
                      <div className="flex flex-col gap-1">
                        {application.company_name || tApplication("company")}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          {application.role || tApplication("no-role")}
                        </span>
                      </div>
                      <div className="mr-3">
                        <Select
                          aria-label="Application status"
                          className={`sm:w-[140px] w-[100px] text-[10px]`}
                          size="sm"
                          selectedKeys={[status || application.status]}
                          onChange={(event) =>
                            onStatusChange(
                              application.application_id,
                              event.target.value as ApplicationStatusType
                            )
                          }
                          classNames={{
                            label: "hidden",
                            popoverContent: "w-32",
                            listboxWrapper: "w-32",
                            listbox: "w-32 text-center",
                            selectorIcon: "hidden",
                            trigger: `flex  
                                  items-center justify-center p-0
                                ${statusToClass[status]}`,
                            value: "text-center",
                          }}
                        >
                          {statusOptions.map((status) => (
                            <SelectItem
                              key={status}
                              classNames={{
                                selectedIcon: "hidden",
                                base: "p-0",
                              }}
                              textValue={status}
                            >
                              <div
                                className={`flex justify-center items-center ${statusToClass[status]} rounded-md text-center w-full h-8`}
                              >
                                {status}
                              </div>
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </ModalHeader>
                  <ModalBody className="space-y-3 ">
                    <div className="overflow-y-scroll h-[60vh]">
                      {infoBlock(
                        tApplication("website"),
                        application.company_website
                      )}
                      {infoBlock(
                        tApplication("link"),
                        application.job_post_link
                      )}
                      {infoBlock(
                        tApplication("location"),
                        capitalizeWords(application.location_type || "")
                      )}
                      {infoBlock(
                        tApplication("place"),
                        application.country_or_region
                      )}
                      {infoBlock(
                        tApplication("summary"),
                        application.job_summary
                      )}
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
                        new Date(
                          application.application_date
                        ).toLocaleDateString() +
                          " " +
                          new Date(
                            application.application_date
                          ).toLocaleTimeString()
                      )}
                      {infoBlock(
                        tApplication("recruiter"),
                        application.recruiter_name
                      )}
                      {infoBlock(
                        tApplication("contact"),
                        application.contact_email
                      )}
                      {infoBlock(
                        tApplication("source"),
                        application.job_post_source
                      )}
                      {infoBlock(tApplication("salary"), application.salary)}

                      {application.skills && application.skills?.length > 0 && (
                        <div className="text-sm mb-3">
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

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          {tApplication("notes")}
                        </label>
                        <Textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder={tApplication("notes_placeholder")}
                          minRows={3}
                          maxLength={MAX_LONG_TEXT_LENGTH}
                          description={`${comments.length} / 1000`}
                        />
                      </div>

                      {documents.length > 0 && (
                        <div className="mb-5">
                          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            {tApplication("documents")}
                          </p>
                          <div>
                            {documents.map((doc) => (
                              <DocumentComponent
                                key={doc.document_id}
                                document={doc}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-5">
                        <Accordion
                          selectedKeys={openKeys}
                          onSelectionChange={(keys) =>
                            setOpenKeys(new Set(keys as unknown as string[]))
                          }
                        >
                          <AccordionItem
                            key="1"
                            aria-label="Job Description Raw"
                            title={tApplication("show_raw_post")}
                          >
                            <div
                              className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                              onClick={() => setOpenKeys(new Set())}
                            >
                              {application.job_description_raw}
                            </div>
                          </AccordionItem>
                        </Accordion>
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
                        saveApplication();
                      }}
                    >
                      {t("common.buttons.save")}
                    </Button>
                  </ModalFooter>{" "}
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
