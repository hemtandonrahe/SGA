import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export function InternalLeadNotificationEmail({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>New {role} waitlist signup: {name}</Preview>
      <Body style={{ backgroundColor: "#05070a", fontFamily: "sans-serif", padding: "40px 0" }}>
        <Container
          style={{
            backgroundColor: "#0b0e13",
            borderRadius: "16px",
            padding: "40px",
            color: "#f5f7fa",
            maxWidth: "480px",
          }}
        >
          <Heading style={{ fontSize: "18px" }}>New waitlist signup</Heading>
          <Text style={{ color: "#a6b0bf", fontSize: "14px", lineHeight: "22px" }}>
            Role: <strong style={{ color: "#f5f7fa" }}>{role}</strong>
            <br />
            Name: {name}
            <br />
            Email: {email}
          </Text>
          <Text style={{ color: "#6b7482", fontSize: "13px", marginTop: "24px" }}>
            View and manage this lead in the admin dashboard under Waitlist.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default InternalLeadNotificationEmail;
