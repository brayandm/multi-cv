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
} from "./utils/components";

export default function DefaultTemplate() {
  return (
    <Div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      {/* Sidebar */}
      <Div
        style={{
          width: "30%",
          backgroundColor: "#f4f0ed",
          padding: "30px 20px",
          boxSizing: "border-box",
        }}
      >
        <Div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <ProfilePicture
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "#ccc",
            }}
          ></ProfilePicture>
        </Div>

        <ContactInfoSection
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#2b2b2b",
            textAlign: "center",
          }}
        />

        <Div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 12,
          }}
        >
          <Email />
          <Phone />
          <Location />
          <LinkedIn />
          <GitHub />
        </Div>
      </Div>

      {/* Main Content */}
      <Div style={{ width: "70%", padding: "30px 40px" }}>
        <Div
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#2b2b2b",
            marginBottom: 4,
          }}
        >
          <FullName />
        </Div>

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
