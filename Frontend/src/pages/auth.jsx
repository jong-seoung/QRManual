import { useState } from "react";

import MainLayout from "../components/layout/MainLayout";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import EmailVerificationForm from "../components/auth/EmailVerificationForm";

const Auth = () => {
  const [authMode, setAuthMode] = useState("login");

  return (
    <MainLayout>
      <div className="max-h-screen flex flex-col items-center mt-30">
        {authMode === "login" && <LoginForm onSwitch={setAuthMode} />}
        {authMode === "signup" && <SignupForm onSwitch={setAuthMode} />}
        {(authMode === "emailVerification" ||
          authMode === "changePassword") && (
          <EmailVerificationForm onSwitch={setAuthMode} mode={authMode} />
        )}
      </div>
    </MainLayout>
  );
};

export default Auth;
