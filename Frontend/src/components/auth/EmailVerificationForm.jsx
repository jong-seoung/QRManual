import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

const EmailVerificationForm = ({ onSwitch, mode, email }) => {
  const { verifyEmail, sendEmail, loading, error } = useAuthStore();

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
    await verifyEmail(formData.code, formData.email);
    onSwitch("login");
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 md:px-6">
      <div className="w-full max-w-[480px]">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1A2633] shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-400"></div>
          <div className="flex flex-col items-center p-8 md:p-10">
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-3xl">
                mark_email_unread
              </span>
            </div>
            <h1 className="text-center text-2xl font-bold tracking-tight text-[#111418] dark:text-white mb-2">
              Check your email
            </h1>
            <p className="text-center text-base font-normal text-gray-500 dark:text-gray-400 mb-8 max-w-[320px]">
              We sent a verification link to
              <span className="font-semibold text-[#111418] dark:text-white">
                {" "}
                {formData.email || "your email address"}
              </span>
              . Enter the 8-digit code below.
            </p>
            {/* <!-- Form --> */}
            <form
              className="w-full flex flex-col gap-6"
              onsubmit="event.preventDefault();"
            >
              {/* <!-- OTP Inputs --> */}
              <div classNameName="flex justify-between gap-2" onPaste={handlePaste}>
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="text"
                    placeholder="-"
                    maxLength={1}
                    classNameName="h-12 w-full flex-1 rounded-lg border border-gray-300
        bg-white dark:bg-gray-800 text-center text-xl font-bold
        focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.code[index] || ""}
                    onChange={(e) => handleCodeChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              <button
                onClick={VerifyhandleSubmit}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary hover:bg-primary-dark h-12 px-4 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm shadow-blue-500/30"
              >
                Verify email
              </button>
            </form>
            {/* <!-- Resend Logic --> */}
            <div className="mt-8 flex flex-col items-center gap-4 text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Didn't receive the email?
                <button
                  onClick={SendEmailHandle}
                  className="ml-1 font-semibold text-primary hover:text-primary-dark hover:underline"
                >
                  Click to resend
                </button>
              </p>
              <div className="h-px w-full bg-gray-100 dark:bg-gray-700"></div>
              <button
                onClick={() => onSwitch("login")}
                className="flex items-center gap-2 font-medium text-gray-500 hover:text-[#111418] dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
                <span>Back to log in</span>
              </button>
            </div>
          </div>
          {/* <!-- Alternative visual footer inside card --> */}
          <div className="bg-gray-50 dark:bg-[#15202b] px-8 py-4 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Protected by DocsPlatform Security.{" "}
              <a
                className="underline hover:text-gray-600 dark:hover:text-gray-400"
                href="#"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmailVerificationForm;
