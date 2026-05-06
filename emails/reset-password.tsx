import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  url: string;
}

const main = {
  backgroundColor: "#fafafa",
  fontFamily:
    "'Source Serif 4', 'Source Serif Pro', Georgia, 'Times New Roman', serif",
  color: "#1a1a1a",
  margin: 0,
  padding: 0,
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "80px 24px 64px 24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: 1.7,
  margin: "0 0 18px 0",
};

const linkStyle = {
  color: "#1a1a1a",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const signoff = {
  fontSize: "16px",
  lineHeight: 1.7,
  margin: "32px 0 0 0",
};

export default function ResetPasswordEmail({
  url = "https://cruda.app/reset-password?token=...",
}: ResetPasswordEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>tu link para volver a entrar</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>hola,</Text>
          <Text style={paragraph}>
            te dejo el link para que puedas restablecer tu contraseña y volver a
            entrar:
          </Text>
          <Text style={paragraph}>
            <Link href={url} style={linkStyle}>
              {url}
            </Link>
          </Text>
          <Text style={paragraph}>
            caduca en una hora. si no fuiste vos quien lo pidió, podés ignorar
            este mail tranquilamente.
          </Text>
          <Text style={signoff}>— Teodoro</Text>
        </Container>
      </Body>
    </Html>
  );
}
