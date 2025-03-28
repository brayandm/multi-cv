"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Switch,
  Button,
  addToast,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { UserResponse } from "@/lib/types";
import useSWR from "swr";
import { userApiLink } from "@/lib/links";
import { fetcherApi, talentPoolApi } from "@/lib/backendService";
import { DEFAULT_CARD_MAX_WIDTH, DEFAULT_CARD_WIDTH } from "@/lib/consts";

export default function SettingsComponent() {
  const t = useTranslations();
  const [accepted, setAccepted] = useState(false);

  const router = useRouter();

  const { data: userData } = useSWR<UserResponse>(userApiLink, fetcherApi);

  useEffect(() => {
    if (userData) {
      setAccepted(userData.is_in_talent_pool ? true : false);
    }
  }, [userData]);

  const changeTalentPool = async () => {
    const value = !accepted;
    setAccepted(value);
    try {
      await talentPoolApi(value);
    } catch {
      console.log("Error");
      setAccepted(!value);
      addToast({
        title: t("common.errors.settings"),
        description: t("common.errors.server"),
        color: "danger",
        timeout: 5000,
      });
    }
  };

  const width = DEFAULT_CARD_WIDTH;
  const maxWidth = DEFAULT_CARD_MAX_WIDTH;

  return (
    <main className="flex justify-center">
      <div
        style={{
          maxWidth: `${maxWidth}vw`,
          width: `${width}px`,
        }}
      >
        <form className="flex flex-col gap-2">
          <Card className="min-h-[75vh]">
            <CardHeader className="pb-0 flex flex-col items-start">
              <div className="px-1 py-1">
                <h1 className="text-xl font-bold">
                  {t("common.menu.settings")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("pages.settings.subtitle")}
                </p>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
              {userData ? (
                <>
                  <div className="flex gap-4">
                    <Switch
                      isSelected={accepted}
                      onValueChange={changeTalentPool}
                      aria-label="Accept switch"
                    />
                    <span className="text-xs font-medium text-gray-600 max-w-[30ch]">
                      {t("common.legal.talent_pool")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      color="primary"
                      variant="bordered"
                      onPress={() => {
                        router.push("/password");
                      }}
                    >
                      {t("pages.settings.password")}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <Spinner variant="dots" />
                </div>
              )}
            </CardBody>
          </Card>
        </form>
      </div>
    </main>
  );
}
