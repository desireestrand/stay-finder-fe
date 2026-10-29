import PageWrapper from "@/components/PageWrapper";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <PageWrapper>
      <main>
        <AuthForm mode="signup" />
      </main>
    </PageWrapper>
  );
}
