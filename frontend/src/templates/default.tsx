import React, { useState } from "react";
import { Cv, dummyCv } from "./utils/types";
import { CvProvider } from "./utils/context";
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
} from "./utils/components";

export default function DefaultTemplate() {
  const [cv, setCv] = useState<Cv>(dummyCv);

  return (
    <CvProvider value={cv} onChange={setCv}>
      <Div style={{ fontFamily: "Arial", padding: 40, color: "#333" }}>
        <FullName />

        <Div className="contact-info" style={{ marginBottom: 20 }}>
          <Email />
          <Phone />
          <Location />
          <LinkedIn />
          <GitHub />
        </Div>

        <Div className="summary-section" style={{ marginTop: 30 }}>
          <Div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              borderBottom: "2px solid #000",
              marginBottom: 10,
            }}
          >
            Summary
          </Div>
          <Summary />
        </Div>

        <Div className="experience-section" style={{ marginTop: 30 }}>
          <Div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              borderBottom: "2px solid #000",
              marginBottom: 10,
            }}
          >
            Experience
          </Div>

          <ExperienceList>
            <Experience>
              <Div style={{ marginBottom: 10 }}>
                <Div>
                  <CompanyName />
                </Div>{" "}
                — <Position />
              </Div>
              <Div>
                <ExperienceLocation /> | <StartDate /> - <EndDate />
              </Div>
              <Div>
                <ExperienceDescriptions>
                  <ExperienceDescription />
                </ExperienceDescriptions>
              </Div>
            </Experience>
          </ExperienceList>
        </Div>
      </Div>
    </CvProvider>
  );
}
