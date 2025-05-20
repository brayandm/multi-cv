import React, { ReactElement, ReactNode, useState } from "react";
import { useCv } from "@/contexts/CvContext";
import { userProfilePictureApiLink } from "@/lib/links";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

export const COLOR_PALETTE = [
  "#f4f0ed",
  "#fef9c3",
  "#cce5ff",
  "#d1fae5",
  "#fbd5d5",
  "#e0e7ff",
];

export const ColorPalette = ({
  onSelect,
  isVisible,
}: {
  onSelect: (color: string) => void;
  isVisible: boolean;
}) => {
  const radius = 60;
  const angles = COLOR_PALETTE.map(
    (_, i) => ((i / COLOR_PALETTE.length) * 270 - 135) * (Math.PI / 180)
  );

  return (
    <motion.div
      style={{
        position: "relative",
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
      }}
    >
      <AnimatePresence>
        {isVisible &&
          COLOR_PALETTE.map((paletteColor, index) => {
            const angle = angles[index];
            const x = radius + radius * Math.cos(angle) - 16;
            const y = radius + radius * Math.sin(angle) - 16;

            return (
              <motion.div
                key={paletteColor}
                onClick={() => onSelect(paletteColor)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: "absolute",
                  top: `${y}px`,
                  left: `${x}px`,
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: paletteColor,
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              />
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
};

const EditableField = ({
  value,
  onEdit,
  type = "span",
  ...props
}: {
  value: string;
  onEdit: (val: string) => void;
  type?: "p" | "span" | "h1" | "h2" | "h3";
} & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  return React.createElement(type, {
    ...props,
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onInput: (e: React.FormEvent<HTMLElement>) =>
      onEdit((e.currentTarget as HTMLElement).textContent || ""),
  });
};

export const Div = ({
  index,
  subindex,
  children,
  ...props
}: {
  index?: number;
  subindex?: number;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ index?: number; subindex?: number }>(child)) {
      return React.cloneElement(child, { index, subindex });
    }
    return child;
  });

  return <div {...props}>{childrenWithProps}</div>;
};

export const ColorableDiv = ({
  index,
  subindex,
  children,
  ...props
}: {
  index?: number;
  subindex?: number;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ index?: number; subindex?: number }>(child)) {
      return React.cloneElement(child, { index, subindex });
    }
    return child;
  });

  const [color, setColor] = useState<string>("#f4f0ed");
  const [hovered, setHovered] = useState<boolean>(false);

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
  };

  return (
    <div
      {...props}
      style={{
        ...props.style,
        position: "relative",
        backgroundColor: color,
        transition: "background-color 0.3s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 10,
        }}
      >
        <ColorPalette onSelect={handleColorSelect} isVisible={hovered} />
      </div>

      {childrenWithProps}
    </div>
  );
};

export const Span = ({
  index,
  subindex,
  children,
  ...props
}: {
  index?: number;
  subindex?: number;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ index?: number; subindex?: number }>(child)) {
      return React.cloneElement(child, { index, subindex });
    }
    return child;
  });

  return <span {...props}>{childrenWithProps}</span>;
};

export const P = ({
  index,
  subindex,
  children,
  ...props
}: {
  index?: number;
  subindex?: number;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ index?: number; subindex?: number }>(child)) {
      return React.cloneElement(child, { index, subindex });
    }
    return child;
  });

  return <p {...props}>{childrenWithProps}</p>;
};

export const H1 = ({
  index,
  subindex,
  children,
  ...props
}: {
  index?: number;
  subindex?: number;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ index?: number; subindex?: number }>(child)) {
      return React.cloneElement(child, { index, subindex });
    }
    return child;
  });

  return <h1 {...props}>{childrenWithProps}</h1>;
};

export const H2 = ({
  index,
  subindex,
  children,
  ...props
}: {
  index?: number;
  subindex?: number;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ index?: number; subindex?: number }>(child)) {
      return React.cloneElement(child, { index, subindex });
    }
    return child;
  });

  return <h2 {...props}>{childrenWithProps}</h2>;
};

export const H3 = ({
  index,
  subindex,
  children,
  ...props
}: {
  index?: number;
  subindex?: number;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ index?: number; subindex?: number }>(child)) {
      return React.cloneElement(child, { index, subindex });
    }
    return child;
  });

  return <h3 {...props}>{childrenWithProps}</h3>;
};

export const ProfilePicture = ({
  ...props
}: {} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img {...props} alt="Profile" src={userProfilePictureApiLink} />
  );
};

export const ContactInfoSection = ({
  ...props
}: {} & React.HTMLAttributes<HTMLDivElement>) => {
  const { cvTexts, setCvTexts } = useCv();

  return (
    <EditableField
      value={cvTexts.contact_info}
      onEdit={(val) => setCvTexts({ ...cvTexts, contact_info: val })}
      type="p"
      {...props}
    />
  );
};

export const FullName = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.full_name}
      onEdit={(val) => setCv({ ...cv, full_name: val })}
      {...props}
    />
  );
};
export const Email = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.email}
      onEdit={(val) => setCv({ ...cv, email: val })}
      {...props}
    />
  );
};

export const Phone = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.phone}
      onEdit={(val) => setCv({ ...cv, phone: val })}
      {...props}
    />
  );
};

export const Location = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.location}
      onEdit={(val) => setCv({ ...cv, location: val })}
      {...props}
    />
  );
};

export const LinkedIn = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.linkedin}
      onEdit={(val) => setCv({ ...cv, linkedin: val })}
      {...props}
    />
  );
};

export const GitHub = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.github}
      onEdit={(val) => setCv({ ...cv, github: val })}
      {...props}
    />
  );
};

export const SummarySection = ({
  ...props
}: {} & React.HTMLAttributes<HTMLDivElement>) => {
  const { cvTexts, setCvTexts } = useCv();
  return (
    <EditableField
      value={cvTexts.summary}
      onEdit={(val) => setCvTexts({ ...cvTexts, summary: val })}
      type="p"
      {...props}
    />
  );
};

export const Summary = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.summary}
      onEdit={(val) => setCv({ ...cv, summary: val })}
      {...props}
    />
  );
};

export const ExperienceSection = ({
  ...props
}: {} & React.HTMLAttributes<HTMLDivElement>) => {
  const { cvTexts, setCvTexts } = useCv();
  return (
    <EditableField
      value={cvTexts.experience}
      onEdit={(val) => setCvTexts({ ...cvTexts, experience: val })}
      type="p"
      {...props}
    />
  );
};

export const ExperienceList = ({
  children,
  ...props
}: {
  children: ReactElement<{ index: number }>;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv } = useCv();
  return (
    <div {...props}>
      {cv.experiences.map((_, i) =>
        React.cloneElement(children, { index: i, key: i })
      )}
    </div>
  );
};

export const Experience = ({
  index = 0,
  children,
}: {
  index?: number;
  children: ReactNode;
}) => (
  <div>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(
          child as React.ReactElement<{ index?: number }>,
          { index }
        );
      }
      return child;
    })}
  </div>
);

export const CompanyName = ({
  index = 0,
  ...props
}: { index?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.experiences[index].company}
      onEdit={(val) => {
        const updated = [...cv.experiences];
        updated[index] = { ...updated[index], company: val };
        setCv({ ...cv, experiences: updated });
      }}
      {...props}
    />
  );
};

export const Position = ({
  index = 0,
  ...props
}: { index?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.experiences[index].position}
      onEdit={(val) => {
        const updated = [...cv.experiences];
        updated[index] = { ...updated[index], position: val };
        setCv({ ...cv, experiences: updated });
      }}
      {...props}
    />
  );
};

export const ExperienceLocation = ({
  index = 0,
  ...props
}: {
  index?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.experiences[index].location}
      onEdit={(val) => {
        const updated = [...cv.experiences];
        updated[index] = { ...updated[index], location: val };
        setCv({ ...cv, experiences: updated });
      }}
      {...props}
    />
  );
};

export const StartDate = ({
  index = 0,
  ...props
}: { index?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.experiences[index].start_date}
      onEdit={(val) => {
        const updated = [...cv.experiences];
        updated[index] = { ...updated[index], start_date: val };
        setCv({ ...cv, experiences: updated });
      }}
      {...props}
    />
  );
};

export const EndDate = ({
  index = 0,
  ...props
}: { index?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  return (
    <EditableField
      value={cv.experiences[index].end_date}
      onEdit={(val) => {
        const updated = [...cv.experiences];
        updated[index] = { ...updated[index], end_date: val };
        setCv({ ...cv, experiences: updated });
      }}
      {...props}
    />
  );
};

export const ExperienceDescriptions = ({
  index = 0,
  children,
  ...props
}: {
  index?: number;
  children: ReactElement<{ index: number; subindex: number }>;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv } = useCv();
  return (
    <div {...props}>
      {cv.experiences[index].descriptions.map((_, j) =>
        React.cloneElement(children, { index, subindex: j, key: j })
      )}
    </div>
  );
};

export const ExperienceDescription = ({
  index = 0,
  subindex = 0,
  ...props
}: {
  index?: number;
  subindex?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { cv, setCv } = useCv();
  const t = useTranslations();
  const [hovered, setHovered] = useState(false);

  const handleDelete = () => {
    const updated = [...cv.experiences];
    const updatedDescriptions = [...updated[index].descriptions];
    updatedDescriptions.splice(subindex, 1);
    updated[index] = {
      ...updated[index],
      descriptions: updatedDescriptions,
    };
    setCv({ ...cv, experiences: updated });
  };

  const handleAddBelow = () => {
    const updated = [...cv.experiences];
    const updatedDescriptions = [...updated[index].descriptions];
    updatedDescriptions.splice(subindex + 1, 0, t("pages.edit_cv.new_bullet"));
    updated[index] = {
      ...updated[index],
      descriptions: updatedDescriptions,
    };
    setCv({ ...cv, experiences: updated });
  };

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ minWidth: "200px", minHeight: "20px" }}>
        <EditableField
          value={cv.experiences[index].descriptions[subindex]}
          onEdit={(val) => {
            const updated = [...cv.experiences];
            const updatedDescriptions = [...updated[index].descriptions];
            updatedDescriptions[subindex] = val;
            updated[index] = {
              ...updated[index],
              descriptions: updatedDescriptions,
            };
            setCv({ ...cv, experiences: updated });
          }}
          {...props}
        />
      </div>
      {hovered && (
        <div className="absolute flex gap-1 z-10 bottom-[-5px] w-24 items-center justify-center">
          <button
            className="bg-white text-sm p-1 border rounded shadow hover:bg-gray-100"
            onClick={handleAddBelow}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            className="bg-white text-sm p-1 border rounded shadow hover:bg-gray-100"
            onClick={handleDelete}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
