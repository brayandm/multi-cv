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

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {application.company_name || "Company"}{" "}
              <span className="text-sm font-normal text-gray-500">
                {application.role || "No role specified"}
              </span>
            </ModalHeader>

            <ModalBody className="space-y-3 ">
              <div className="overflow-scroll h-[60vh]">
                {infoBlock("Website", application.company_website)}
                {infoBlock("Job Post Link", application.job_post_link)}
                {infoBlock("Location Type", application.location_type)}
                {infoBlock("Country or Region", application.country_or_region)}
                {infoBlock("Job Summary", application.job_summary)}
                {application.job_bullets &&
                  application.job_bullets?.length > 0 && (
                    <div className="text-sm mb-3">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        Job Bullets:
                      </span>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                        {application.job_bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {infoBlock(
                  "Application Date",
                  new Date(application.application_date).toLocaleDateString()
                )}
                {infoBlock("Status", application.status)}
                {infoBlock("Recruiter", application.recruiter_name)}
                {infoBlock("Contact Email", application.contact_email)}
                {infoBlock("Source", application.job_post_source)}
                {infoBlock("Salary", application.salary)}

                {application.skills && application.skills?.length > 0 && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Skills:
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
                    title="Show Raw Job Description"
                  >
                    <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                      {application.job_description_raw}
                    </div>
                  </AccordionItem>
                </Accordion>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Notes
                  </label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Write your notes about this application..."
                    minRows={3}
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
