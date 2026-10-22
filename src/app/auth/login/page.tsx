import PageWrapper from "@/components/PageWrapper";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <PageWrapper>
      <main>
        <AuthForm mode="login" />
      </main>
    </PageWrapper>
  );
}
