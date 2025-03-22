"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import BasicUserInfo from "./BasicUserInfo";
import Experience from "./Experience";
import { useTranslations } from "next-intl";
import Skills from "./Skills";
import Projects from "./Projects";
import ProfessionalLinks from "./ProfessionalLinks";
import Education from "./Education";
// import ChatComponent from "@/shared/components/ChatComponent";
import { useProfile } from "@/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import { finishFirstLoginApi } from "@/lib/backendService";
import { useRouterCustom } from "@/contexts/RouterCustomContext";

interface IProfileComponentProps {
  isFirstLogin: boolean;
}

const ProfileComponent = ({ isFirstLogin = false }: IProfileComponentProps) => {
  const width = 350;

  const router = useRouter();

  const { unlock, lock, setOnAttemptedNavigation } = useRouterCustom();

  const { isLoaded, syncProfile, pullProfile, checkArePendingChanges } =
    useProfile();

  const formRef = useRef<HTMLFormElement>(null);

  const t = useTranslations();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedTab, setSelectedTab] =
    useState<keyof typeof mapPosition>("basic-user-info");

  const [selectedPendingTab, setSelectedPendingTab] =
    useState<keyof typeof mapPosition>("basic-user-info");

  const mapPosition = React.useMemo(
    () => ({
      "basic-user-info": 0,
      "professional-links": 1,
      experiences: 2,
      educations: 3,
      projects: 4,
      skills: 5,
    }),
    []
  );
  const positions = Object.keys(mapPosition) as Array<keyof typeof mapPosition>;
  const nextPositionIsAvailable = () => {
    return mapPosition[selectedTab] + 1 < positions.length;
  };

  const prevPositionIsAvailable = () => {
    return mapPosition[selectedTab] - 1 >= 0;
  };

  const ref = useRef<HTMLDivElement>(null);

  const smoothScroll = (start: number, end: number, duration: number) => {
    let startTime: number | null = null;

    function animationStep(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeInOutQuad =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (ref.current) {
        ref.current.scrollLeft = start + (end - start) * easeInOutQuad;
      }

      if (progress < 1) {
        requestAnimationFrame(animationStep);
      }
    }

    requestAnimationFrame(animationStep);
  };

  useEffect(() => {
    if (!ref.current) return;

    const index = mapPosition[selectedTab] - 1;
    if (index < 0) return;

    const positionChild =
      ref.current.children[index].getBoundingClientRect().left;
    const positionParent = ref.current.getBoundingClientRect().left;
    const targetScroll =
      ref.current.scrollLeft + (positionChild - positionParent - 4);

    smoothScroll(ref.current.scrollLeft, targetScroll, 700);
  }, [selectedTab, mapPosition]);

  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    lock();
    return () => {
      unlock();
    };
  }, [lock, unlock]);

  useEffect(() => {
    setOnAttemptedNavigation(() => {
      if (checkArePendingChanges()) {
        onOpen();
        return;
      }
      unlock();
    });
  }, [onOpen, setOnAttemptedNavigation, unlock, checkArePendingChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [onOpen]);

  return (
    <main className="flex justify-center">
      {/* <ChatComponent /> */}
      <div className={`max-w-[${width}px]`}>
        <form className="flex flex-col gap-2" ref={formRef}>
          <Card className="min-h-[75vh]">
            <CardHeader className="pb-0 flex flex-col items-start">
              <div className="px-1 py-1">
                <h1>{t("common.menu.profile")}</h1>
                <p>{t("pages.profile.subtitle")}</p>
              </div>
            </CardHeader>
            <CardBody>
              {isLoaded && (
                <Tabs
                  aria-label="Options"
                  color="primary"
                  classNames={{ base: "p-2", tabList: "" }}
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => {
                    if ((key as keyof typeof mapPosition) !== selectedTab) {
                      if (checkArePendingChanges()) {
                        onOpen();
                        setSelectedPendingTab(key as keyof typeof mapPosition);
                      } else {
                        setSelectedTab(key as keyof typeof mapPosition);
                      }
                    }
                  }}
                  ref={ref}
                  disabledKeys={
                    isFirstLogin
                      ? positions.filter((key) => key !== selectedTab)
                      : []
                  }
                >
                  <Tab
                    key="basic-user-info"
                    title={t("pages.profile.sections.basic_info.title")}
                  >
                    <BasicUserInfo />
                  </Tab>
                  <Tab
                    key="professional-links"
                    title={t("pages.profile.sections.professional_links.title")}
                  >
                    <ProfessionalLinks />
                  </Tab>
                  <Tab
                    key="experiences"
                    title={t("pages.profile.sections.experience.title")}
                  >
                    <Experience formRef={formRef} />
                  </Tab>
                  <Tab
                    key="educations"
                    title={t("pages.profile.sections.education.title")}
                  >
                    <Education formRef={formRef} />
                  </Tab>
                  <Tab
                    key="projects"
                    title={t("pages.profile.sections.projects.title")}
                  >
                    <Projects formRef={formRef} />
                  </Tab>
                  <Tab
                    key="skills"
                    title={t("pages.profile.sections.skills.title")}
                  >
                    <Skills />
                  </Tab>
                </Tabs>
              )}
            </CardBody>
          </Card>
          <div className="flex flex-row justify-between gap-1">
            {isFirstLogin && prevPositionIsAvailable() && (
              <Card className="mb-3 w-full">
                <Button
                  color="primary"
                  onPress={() => {
                    setSelectedTab(positions[mapPosition[selectedTab] - 1]);
                    syncProfile();
                  }}
                >
                  {t("common.buttons.previous")}
                </Button>
              </Card>
            )}
            {isFirstLogin && (
              <Card className="mb-3 w-full">
                <Button
                  color="primary"
                  onPress={async () => {
                    if (!formRef.current || !formRef.current.reportValidity())
                      return;
                    if (!nextPositionIsAvailable()) {
                      await syncProfile();
                      await finishFirstLoginApi();
                      router.push("/profile/success");
                      return;
                    }
                    setSelectedTab(positions[mapPosition[selectedTab] + 1]);
                    syncProfile();
                  }}
                >
                  {t("common.buttons.next")}
                </Button>
              </Card>
            )}
            {!isFirstLogin && (
              <>
                <Card className="mb-3 w-full">
                  <Button
                    color="primary"
                    onPress={async () => {
                      if (!formRef.current || !formRef.current.reportValidity())
                        return;
                      setSaveLoading(true);
                      await syncProfile();
                      setSaveLoading(false);
                    }}
                    isLoading={saveLoading}
                  >
                    {t("common.buttons.save")}
                  </Button>
                </Card>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          <h3>{t("common.texts.draft_changes")}</h3>
                        </ModalHeader>
                        <ModalBody>
                          <p>{t("common.texts.draft_changes_description")}</p>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            onPress={async () => {
                              await pullProfile();
                              setSelectedTab(selectedPendingTab);
                              onClose();
                              unlock();
                            }}
                          >
                            {t("common.buttons.discard")}
                          </Button>
                          <Button
                            color="primary"
                            variant="light"
                            onPress={async () => {
                              if (
                                !formRef.current ||
                                !formRef.current.reportValidity()
                              ) {
                                onClose();
                                return;
                              }
                              setSaveLoading(true);
                              await syncProfile();
                              setSaveLoading(false);

                              onClose();
                              unlock();

                              setSelectedTab(selectedPendingTab);
                            }}
                          >
                            {t("common.buttons.save")}
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileComponent;
