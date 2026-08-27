import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

const roleCopy: Record<string, string> = {
  player: "as a player",
  facility: "as a facility",
  partner: "as an industry partner",
};

export function WaitlistConfirmationEmail({ name, role }: { name: string; role: string }) {
  const roleLabel = roleCopy[role] ?? "";
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the SGA waitlist</Preview>
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
          <Heading style={{ fontSize: "20px", color: "#f5f7fa" }}>You&apos;re on the list, {name}.</Heading>
          <Text style={{ color: "#a6b0bf", fontSize: "15px", lineHeight: "24px" }}>
            Thanks for joining the SGA waitlist {roleLabel}. SGA is building the trusted
            competitive network for simulated golf — verified scores, portable rankings, real
            competition, and access to certified places to play.
          </Text>
          <Text style={{ color: "#a6b0bf", fontSize: "15px", lineHeight: "24px" }}>
            We&apos;ll be in touch as soon as there&apos;s a next step for you. In the meantime,
            keep an eye on your inbox.
          </Text>
          <Text style={{ color: "#6b7482", fontSize: "13px", marginTop: "32px" }}>— The SGA Team</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WaitlistConfirmationEmail;
