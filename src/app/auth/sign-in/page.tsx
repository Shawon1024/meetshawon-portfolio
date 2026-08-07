import SignInForm from "../../components/auth/SignInForm";

export default function SignInPage() {
  return (
    <main className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-lg">
        <SignInForm />
      </div>
    </main>
  );
}