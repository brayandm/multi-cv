import {
  CompanyName,
  Email,
  Experience,
  ExperienceList,
  FullName,
  GitHub,
  LinkedIn,
  Location,
  Phone,
  Position,
  StartDate,
  EndDate,
  ExperienceLocation,
  Summary,
  ExperienceDescriptions,
  ExperienceDescription,
  Div,
  Span,
  ExperienceSection,
  ContactInfoSection,
  SummarySection,
  ProfilePicture,
  ColorableDiv,
} from "./utils/components";

export default function CreativeTopBarTemplate() {
  return (
    <Div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      {/* Top Presentation Card */}
      <ColorableDiv
        style={{
          width: "100%",
          backgroundColor: "#f4f0ed",
          padding: "40px 30px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          borderBottom: "4px solid #2b2b2b",
          gap: "30px",
        }}
      >
        <Div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <ProfilePicture
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: "#ccc",
              border: "3px solid #2b2b2b",
            }}
          />
          <Div>
            <Div style={{ fontSize: 36, fontWeight: "bold", color: "#2b2b2b" }}>
              <FullName />
            </Div>
            <ContactInfoSection
              style={{
                fontSize: 16,
                marginTop: 4,
                color: "#555",
              }}
            />
          </Div>
        </Div>

        {/* Contact Details as badges */}
        <Div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Badge>
            <Email />
          </Badge>
          <Badge>
            <Phone />
          </Badge>
          <Badge>
            <Location />
          </Badge>
          <Badge>
            <LinkedIn />
          </Badge>
          <Badge>
            <GitHub />
          </Badge>
        </Div>
      </ColorableDiv>

      {/* Main Content */}
      <Div style={{ padding: "30px 40px" }}>
        <Div className="summary-section" style={{ marginBottom: 40 }}>
          <SummarySection
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#000",
              borderBottom: "2px solid #000",
              marginBottom: 10,
            }}
          />
          <Summary />
        </Div>

        <Div className="experience-section">
          <ExperienceSection
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#2b2b2b",
              borderBottom: "2px solid #000",
              marginBottom: 20,
            }}
          />
          <ExperienceList>
            <Experience>
              <Div style={{ marginBottom: 30 }}>
                <Div style={{ fontWeight: "bold" }}>
                  <CompanyName />, <Position />
                </Div>
                <Div style={{ fontSize: 14, color: "#555" }}>
                  <StartDate /> - <EndDate />
                </Div>
                <Div style={{ fontSize: 14, color: "#555" }}>
                  <ExperienceLocation />
                </Div>
                <Div
                  style={{
                    marginTop: 10,
                    paddingLeft: 20,
                    fontSize: 14,
                  }}
                >
                  <ExperienceDescriptions>
                    <Div style={{ marginTop: 2 }}>
                      <Span>- </Span>
                      <ExperienceDescription />
                    </Div>
                  </ExperienceDescriptions>
                </Div>
              </Div>
            </Experience>
          </ExperienceList>
        </Div>
      </Div>
    </Div>
  );
}

import React from "react";

function Badge({ children }: React.PropsWithChildren<object>) {
  return (
    <Div
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "20px",
        backgroundColor: "#575757",
        color: "#fff",
        fontSize: 12,
      }}
    >
      {children}
    </Div>
  );
}
