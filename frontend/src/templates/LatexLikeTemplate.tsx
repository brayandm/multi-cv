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
  SummarySection,
} from "./utils/components";

export default function LatexModernCvWithSections() {
  return (
    <Div
      style={{
        width: "100%",
        height: "100%",
        padding: "40px 60px",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        fontFamily: "serif",
        color: "#000",
      }}
    >
      {/* Header: Full Name Centered */}
      <Div style={{ textAlign: "center", marginBottom: 10 }}>
        <Div style={{ fontSize: 32, fontWeight: "bold" }}>
          <FullName />
        </Div>
        <Div style={{ fontSize: 12, marginTop: 4 }}>
          <Div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            <Location /> | <Phone /> | <Email /> | <LinkedIn /> | <GitHub />
          </Div>
        </Div>
      </Div>

      {/* Summary Section */}
      <SectionTitle>
        <SummarySection
          style={{
            fontWeight: "bold",
          }}
        />
      </SectionTitle>
      <Summary style={{ fontSize: 12, marginBottom: 20 }} />

      {/* Experience Section */}
      <SectionTitle>
        <ExperienceSection
          style={{
            fontWeight: "bold",
          }}
        />
      </SectionTitle>
      <ExperienceList>
        <Experience>
          <Div style={{ marginBottom: 20 }}>
            <Div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "semibold",
              }}
            >
              <Div>
                <CompanyName />, <Position />
              </Div>
              <Div style={{ fontSize: 12, color: "#555" }}>
                <StartDate /> – <EndDate />
              </Div>
            </Div>
            <Div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
              <ExperienceLocation />
            </Div>
            <Div style={{ fontSize: 12, paddingLeft: 20 }}>
              <ExperienceDescriptions>
                <Div
                  style={{
                    marginTop: 2,
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Span>• </Span>
                  <ExperienceDescription />
                </Div>
              </ExperienceDescriptions>
            </Div>
          </Div>
        </Experience>
      </ExperienceList>
    </Div>
  );
}

function SectionTitle({ children }: React.PropsWithChildren<object>) {
  return (
    <Div
      style={{
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginTop: 20,
        marginBottom: 4,
        borderBottom: "1px solid #000",
      }}
    >
      {children}
    </Div>
  );
}
