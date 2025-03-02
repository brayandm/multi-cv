import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@heroui/react";
import { CV as CvComponentProps } from "@/lib/types";

const CvComponent: React.FC<CvComponentProps> = (props) => {
  const [isDownloaded, setIsDownloaded] = React.useState(false);

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => {
      setIsDownloaded(false);
    }, 2000);
  };
  return (
    <Card className="max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src={props.image} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {props.company}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {props.role}
            </h5>
          </div>
        </div>
        <Button
          className={
            isDownloaded
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isDownloaded ? "bordered" : "solid"}
          onPress={handleDownload}
        >
          {isDownloaded ? "Download" : "Download"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-600">
        <p>{props.job_description}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {props.pdf_file}
          </p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {props.days_to_expire} days
          </p>
          <p className="text-default-500 text-small">To expire</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CvComponent;
