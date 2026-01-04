import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

const ChangePassword = ({ onSwitch, mode, email }) => {
  const { PasswordResetCode, resetPassword, sendEmail } = useAuthStore();
  const [verified, setVerified] = useState(false);

  const CODE_LENGTH = 8;
  const [formData, setFormData] = useState({
    email: "",
    authCode: "",
    code: "",
  });

  useEffect(() => {
    if (!email) return;

    setFormData((prev) => ({ ...prev, email }));
    sendEmail(email);
  }, [email]);

  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    if (!value) return;

    const char = value.slice(-1);
    setFormData((prev) => {
      const codeArray = prev.code.split("");
      codeArray[index] = char;
      return { ...prev, code: codeArray.join("") };
    });

    if (index < CODE_LENGTH - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key !== "Backspace") return;

    e.preventDefault();

    setFormData((prev) => {
      const codeArray = prev.code.split("");

      if (codeArray[index]) {
        codeArray[index] = "";
        return { ...prev, code: codeArray.join("") };
      }

      if (index > 0) {
        codeArray[index - 1] = "";
        setTimeout(() => {
          document.getElementById(`otp-${index - 1}`)?.focus();
        }, 0);
      }

      return { ...prev, code: codeArray.join("") };
    });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, CODE_LENGTH);

    setFormData((prev) => ({
      ...prev,
      code: pasted,
    }));

    const lastIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  const SendEmailHandle = async (e) => {
    e.preventDefault();
    try {
      await sendEmail(formData.email);
    } catch (err) {
      console.error(err);
    }
  };

  const VerifyhandleSubmit = async (e) => {
    e.preventDefault();
    const token = await PasswordResetCode(formData.code, formData.email);

    setFormData((prev) => ({ ...prev, authCode: token }));
    setVerified(true);
  };

  const PasswordhandleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await resetPassword({
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        authCode: formData.authCode,
      });
      onSwitch("passwordResetComplete");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-lg">
        {/* <!-- Card --> */}
        <div class="bg-white dark:bg-[#1a222d] shadow-lg rounded-xl border border-[#e5e7eb] dark:border-[#2a3441] overflow-hidden">
          {/* <!-- Header Section --> */}
          <div class="p-8 pb-4">
            <h1 class="text-[#111418] dark:text-white tracking-tight text-[28px] font-bold leading-tight mb-3">
              Reset Password
            </h1>
            <p class="text-[#617589] dark:text-[#94a3b8] text-sm font-normal leading-relaxed">
              We sent a 8-digit code to{" "}
              <span class="font-semibold text-[#111418] dark:text-gray-200">
                {formData.email || "your email address"}
              </span>
              . Please enter it below along with your new password to secure
              your account.
            </p>
          </div>
          {/* <!-- Form Section --> */}
          <div class="px-8 pb-8 space-y-6">
            {/* <!-- Verification Code Input --> */}
            <div>
              <label class="block text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal mb-3">
                Verification Code
              </label>
              {/* <!-- OTP Inputs --> */}
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="text"
                    placeholder="-"
                    maxLength={1}
                    className="h-12 w-full flex-1 rounded-lg border border-gray-300
        bg-white dark:bg-gray-800 text-center text-xl font-bold
        focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.code[index] || ""}
                    onChange={(e) => handleCodeChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              <div class="mt-3 flex justify-end">
                <button
                  onClick={SendEmailHandle}
                  class="text-primary hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
                >
                  Didn't receive the email? Resend Code
                </button>
              </div>

              {!verified && (
                <div class="pt-2">
                  <button
                    onClick={VerifyhandleSubmit}
                    class="w-full h-12 flex items-center justify-center rounded-lg bg-primary hover:bg-[#106cd0] text-white text-base font-bold shadow-sm transition-all focus:ring-4 focus:ring-primary/30"
                  >
                    인증하기
                  </button>
                </div>
              )}
            </div>
            {verified && (
              <>
                {/* Password Fields */}
                <div class="space-y-5">
                  {/* New Password */}
                  <div>
                    <label class="block text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      class="w-full h-12 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5e] bg-white dark:bg-[#151b23] px-4 pr-12 text-[#111418] dark:text-white placeholder-[#617589] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                      placeholder="Min. 8 characters"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label class="block text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal mb-2">
                      New Password Confirm New Password
                    </label>
                    <input
                      type="password"
                      class="w-full h-12 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5e] bg-white dark:bg-[#151b23] px-4 pr-12 text-[#111418] dark:text-white placeholder-[#617589] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                      placeholder="Re-enter password"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password2: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <div class="pt-2">
                  <button
                    onClick={PasswordhandleSubmit}
                    class="w-full h-12 rounded-lg bg-primary text-white font-bold"
                  >
                    Reset Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* <!-- Footer Link --> */}
        <div class="mt-6 text-center">
          <a
            class="inline-flex items-center gap-2 text-sm font-medium text-[#617589] dark:text-[#94a3b8] hover:text-[#111418] dark:hover:text-white transition-colors group"
            href="#"
          >
            <span class="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Return to Login
          </a>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
