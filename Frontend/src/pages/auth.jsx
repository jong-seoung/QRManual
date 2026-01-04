import { useState } from "react";

import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import EmailVerificationForm from "../components/auth/EmailVerificationForm";
import PasswordEmailVerificationForm from "../components/auth/PasswordEmailVerificationForm";
import ResetPassword from "../components/auth/ResetPassword";
import ResetPasswordComplete from "../components/auth/ResetPasswodComplete";

const Auth = () => {
  const [authMode, setAuthMode] = useState("login");
  const [verifyEmail, setVerifyEmail] = useState("");

  const handleSwitch = (mode, payload) => {
    if (payload?.email) {
      setVerifyEmail(payload.email);
    }
    setAuthMode(mode);
  };

  return (
    <AuthLayout>
      <div>
        {authMode === "login" && <LoginForm onSwitch={handleSwitch} />}
        {authMode === "signup" && <SignupForm onSwitch={handleSwitch} />}
        {authMode === "emailVerification" && (
          <EmailVerificationForm
            onSwitch={handleSwitch}
            mode={authMode}
            email={verifyEmail}
          />
        )}
        {authMode === "changePassword" && (
          <PasswordEmailVerificationForm
            onSwitch={handleSwitch}
            mode={authMode}
          />
        )}
        {authMode === "resetPassword" && (
          <ResetPassword
            onSwitch={handleSwitch}
            mode={authMode}
            email={verifyEmail}
          />
        )}
        {authMode === "passwordResetComplete" && (
          <ResetPasswordComplete
            onSwitch={handleSwitch}
          />
        )}
        
      </div>
    </AuthLayout>
  );
};

export default Auth;
