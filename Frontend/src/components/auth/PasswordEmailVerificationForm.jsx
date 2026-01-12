import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

const EmailVerificationForm = ({ onSwitch, mode }) => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일이 존재하는지 먼저 확인

    onSwitch("resetPassword", { email: formData.email });
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* <!-- Card Container --> */}
        <div className="bg-surface-light dark:bg-surface-dark shadow-sm ring-1 ring-border-light dark:ring-border-dark rounded-xl px-8 py-10 sm:px-10 sm:py-12">
          {/* <!-- Header Section --> */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
              <span className="material-symbols-outlined text-4xl text-primary">
                lock_reset
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-main dark:text-white sm:text-3xl">
              Reset your password
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-gray-400">
              Enter the email address associated with your account and we'll
              send you a verification code to reset your password.
            </p>
          </div>
          {/* <!-- Form Section --> */}
          <form action="#" className="space-y-6" method="POST">
            <div>
              <label
                className="block text-sm font-medium leading-6 text-text-main dark:text-gray-200"
                for="email"
              >
                Email address
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined h-5 w-5 text-text-secondary dark:text-gray-500 text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full rounded-lg border-0 py-3 pl-10 text-text-main shadow-sm ring-1 ring-inset ring-border-light placeholder:text-text-secondary focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-background-dark dark:text-white dark:ring-border-dark dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <button
                className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
                onClick={handleSubmit}
              >
                Send Verification Code
              </button>
            </div>
          </form>
          {/* <!-- Footer Link --> */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary dark:text-gray-400">
              Remember your password?
              <a
                className="font-semibold leading-6 text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1 mt-2 group"
                href="#"
              >
                <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">
                  arrow_back
                </span>
                Return to login
              </a>
            </p>
          </div>
        </div>
        {/* <!-- Footer Information --> */}
        <p className="text-center text-xs leading-5 text-text-secondary dark:text-gray-500">
          © 2024 QR Docs Platform. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default EmailVerificationForm;
