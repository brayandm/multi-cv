"use client";
import React from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { ISocial, useProfile } from "@/lib/ProfileContext";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { Avatar, Image, Select, SelectItem } from "@heroui/react";
import { SelectIconInputsStyles } from "@/lib/customStyles";

export const socials = [
  {
    name: "Github",
    avatar: "icons/companies/github.png",
    url: "https://github.com/",
  },
  {
    name: "Linkedin",
    avatar: "icons/companies/linkedin.webp",
    url: "https://www.linkedin.com/in/",
  },
  {
    name: "Portfolio",
    avatar: "icons/others/portfolio.png",
    url: "https://yourportfolio.amz/",
  },
];

const Socials: React.FC = () => {
  const { profile, updateProfile } = useProfile();

  const t = useTranslations();
  function onSocialChange(
    index: number,
    key: keyof ISocial,
    value: string | boolean
  ) {
    const updatedSocials = [...profile.socials];
    updatedSocials[index] = { ...updatedSocials[index], [key]: value };

    updateProfile({
      ...profile,
      socials: updatedSocials,
    });
  }

  function updateSocials(newSelectedSocials: string[]) {
    const updatedSocials = newSelectedSocials.map((social) => {
      const found = profile.socials.find((s) => s.name === social);
      return found || { name: social, link: "" };
    });

    updateProfile({
      ...profile,
      socials: updatedSocials,
    });
  }

  return (
    <div className="px-1">
      <Select
        classNames={SelectIconInputsStyles}
        className="mb-2"
        isMultiline={true}
        items={socials}
        selectedKeys={profile.socials.map((social) => social.name)}
        label={t("common.form.socials_select")}
        placeholder={t("common.placeholders.socials_select")}
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item, id) => (
                <Image
                  className="w-6 h-6"
                  src={item.data?.avatar}
                  alt="asdd"
                  key={id}
                ></Image>
              ))}
            </div>
          );
        }}
        onSelectionChange={(e) => {
          updateSocials([...e] as string[]);
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
      {profile.socials.map((social, index) => {
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

export default Socials;
