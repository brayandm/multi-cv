"use client";
import React, { useEffect, useState } from "react";
import {
  IDynamicInputArray,
  IProfileFrom,
  ISocial,
} from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { Avatar, Image, Select, SelectItem } from "@heroui/react";

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

interface IBasicUserInfoProps {
  formData: IProfileFrom;
  selectedSocials: Array<string>;
  width: number;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
  setSelectedSocials: React.Dispatch<React.SetStateAction<Array<string>>>;
}

const Socials: React.FC<IBasicUserInfoProps> = (props) => {
  const [socialsArray, setSocialsArray] = useState<ISocial[]>(
    props.formData.socials
  );
  const t = useTranslations();
  function onSocialChange(
    index: number,
    key: keyof ISocial,
    value: string | boolean
  ) {
    const updatedSocials = [...socialsArray];
    updatedSocials[index] = { ...updatedSocials[index], [key]: value };

    setSocialsArray(updatedSocials);
    props.setFormData({
      ...props.formData,
      socials: updatedSocials,
    });
  }

  function updateSocialsArray(newSelectedSocials: string[]) {
    const newSocialsArray: ISocial[] = [];
    newSelectedSocials.map((selectedSocial) => {
      if (!socialsArray.find((social) => social.name === selectedSocial)) {
        newSocialsArray.push({ link: "", name: selectedSocial });
      }
    });

    setSocialsArray([
      ...socialsArray.filter((social) =>
        newSelectedSocials.includes(social.name)
      ),
      ...newSocialsArray,
    ]);
  }

  useEffect(() => {
    props.setFormData({
      ...props.formData,
      socials: [
        ...socialsArray.filter((social) =>
          props.selectedSocials.includes(social.name)
        ),
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socialsArray, props.selectedSocials]);

  return (
    <div className="px-1">
      <Select
        classNames={{
          trigger: "min-h-12 py-2",
        }}
        className="mb-2"
        isMultiline={true}
        items={socials}
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
          props.setSelectedSocials(() => [...e] as string[]);
          updateSocialsArray([...e] as string[]);
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
      {socialsArray.map((social, index) => {
        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: social?.name || "",
            type: "text",
            placeholder: t("common.placeholders.enter_company_name"),
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
