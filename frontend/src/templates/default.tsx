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
  return (
    <Div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        display: "flex",
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#fff",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
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
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "#ccc",
            margin: "0 auto 20px",
          }}
        ></Div>

        <Div
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Contact Details
        </Div>
        <Div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
        <Div style={{ fontSize: 18, color: "#666", marginBottom: 30 }}>
          Html Developer
        </Div>

        <Div className="summary-section" style={{ marginBottom: 40 }}>
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

        <Div className="experience-section">
          <Div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              borderBottom: "2px solid #000",
              marginBottom: 20,
            }}
          >
            Work Experience
          </Div>

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
                <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                  <ExperienceDescriptions>
                    <ExperienceDescription />
                  </ExperienceDescriptions>
                </ul>
              </Div>
            </Experience>
          </ExperienceList>
        </Div>
      </Div>
    </Div>
  );
}
