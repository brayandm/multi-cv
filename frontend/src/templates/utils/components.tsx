import React, { ReactElement, ReactNode, useState } from "react";
import { useCv } from "@/contexts/CvContext";
import { userProfilePictureApiLink } from "@/lib/links";

export const COLOR_PALETTE = [
  "#2563eb",
  "#059669",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#0f172a",
];

export const ColorPalette = ({
  onSelect,
}: {
  onSelect: (color: string) => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        padding: "4px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {COLOR_PALETTE.map((paletteColor) => (
        <div
          key={paletteColor}
          onClick={() => onSelect(paletteColor)}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            backgroundColor: paletteColor,
            cursor: "pointer",
            border: "1px solid #ccc",
          }}
        />
      ))}
    </div>
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

  const [color, setColor] = useState<string>("white");
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
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 10,
          }}
        >
          <ColorPalette onSelect={handleColorSelect} />
        </div>
      )}

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
  return (
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
  );
};
