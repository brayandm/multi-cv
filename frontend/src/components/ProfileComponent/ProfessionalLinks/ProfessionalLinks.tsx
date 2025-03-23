"use client";
import React, { useEffect } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { IProfessionalLinks, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { Avatar, Image, Select, SelectItem } from "@heroui/react";
import { SelectIconInputsStyles } from "@/lib/customStyles";
import { useChat } from "@/contexts/ChatContext";

export const professionalLinks = [
  {
    name: "Github",
    avatar: "/icons/companies/github.png",
    url: "https://github.com/",
  },
  {
    name: "Linkedin",
    avatar: "/icons/companies/linkedin.webp",
    url: "https://www.linkedin.com/in/",
  },
  {
    name: "Portfolio",
    avatar: "/icons/others/portfolio.png",
    url: "https://yourportfolio.amz/",
  },
];

const ProfessionalLinks: React.FC = () => {
  const {
    professionalLinks: professionalLinksList,
    updateProfessionalLinks: updateProfessionalLinksList,
    syncProfileOnFirstLogin,
  } = useProfile();

  const { setChat } = useChat();

  useEffect(() => {
    setChat(null);
  }, [setChat]);

  const t = useTranslations();
  function onSocialChange(
    index: number,
    key: keyof IProfessionalLinks,
    value: string | boolean
  ) {
    const updatedProfessionalLinks = [...professionalLinksList];
    updatedProfessionalLinks[index] = {
      ...updatedProfessionalLinks[index],
      [key]: value,
    };

    updateProfessionalLinksList(updatedProfessionalLinks);
  }

  function updateProfessionalLinks(newSelectedProfessionalLinks: string[]) {
    const updatedProfessionalLinks = newSelectedProfessionalLinks.map(
      (social) => {
        const found = professionalLinksList.find((s) => s.name === social);
        return found || { name: social, link: "" };
      }
    );

    updateProfessionalLinksList(updatedProfessionalLinks);
  }

  return (
    <div className="px-1">
      <Select
        classNames={SelectIconInputsStyles}
        className="mb-2"
        isMultiline={true}
        items={professionalLinks}
        selectedKeys={professionalLinksList.map((social) => social.name)}
        label={t("common.form.professional_links_select")}
        placeholder={t("common.placeholders.professional_links_select")}
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item, id) => (
                <Image
                  className="w-6 h-6"
                  src={item.data?.avatar}
                  alt="avatar"
                  key={id}
                ></Image>
              ))}
            </div>
          );
        }}
        onSelectionChange={(e) => {
          updateProfessionalLinks([...e] as string[]);
        }}
        selectionMode="multiple"
      >
        {(item) => (
          <SelectItem key={item.name} textValue={item.name}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={item.name}
                className="flex-shrink-0 bg-white mix-blend-multiply"
                size="sm"
                src={item.avatar}
              />
              <div className="flex flex-col">
                <span className="text-small">{item.name}</span>
                <span className="text-tiny text-default-400">{item.url}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
      {professionalLinksList.map((social, index) => {
        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: social?.name || "",
            type: "text",
            placeholder: t("common.placeholders.enter_your_link", {
              field: social?.name,
            }),
            onValueChange: (value: string) =>
              onSocialChange(index, "link", value),
            value: social?.link || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
        ];

        return (
          <div key={index} className="pb-2">
            <DynamicInputs inputs={inputs}></DynamicInputs>
          </div>
        );
      })}
    </div>
  );
};

export default ProfessionalLinks;
