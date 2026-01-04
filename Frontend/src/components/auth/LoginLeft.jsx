import { useState } from "react";
import useAuthStore from "../../store/authStore.js";

const LoginLeft = ({ onSwitch }) => {
  const { login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = isEmail(formData.emailOrUsername)
        ? { email: formData.emailOrUsername, password: formData.password }
        : { username: formData.emailOrUsername, password: formData.password };

      await login(loginData);
      onSwitch("login");
    } catch (err) {
      alert(
        "Login failed: " +
          err.response +
          ", " +
          err.response.status +
          ", " +
          err.response.data.message
      );
      if (
        err.response &&
        err.response.status === 403 &&
        err.response.data.message === "계정 활성화가 필요합니다."
      ) {
        onSwitch("emailVerification", { email: formData.email });
      } else {
        setError(
          err.response?.data?.message || "로그인 중 오류가 발생했습니다."
        );
      }
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex flex-col justify-center p-8 md:p-12 w-full md:w-1/2 gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
          Welcome back
        </h1>
        <p className="text-[#617589] dark:text-[#9aa0a6] text-sm font-normal leading-normal">
          Log in to manage your product documentation and QR codes.
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col w-full gap-2">
          <span className="text-[#111418] dark:text-white text-sm font-medium leading-normal">
            Email address
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-4 material-symbols-outlined text-[#617589] dark:text-[#9aa0a6] text-[20px]">
              mail
            </span>
            <input
              className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbe0e6] dark:border-[#3e4856] bg-white dark:bg-[#111418] focus:border-primary h-12 placeholder:text-[#617589] dark:placeholder:text-[#6e7781] py-2 pl-11 pr-4 text-sm font-normal leading-normal transition-all"
              type="email"
              name="emailOrUsername"
              placeholder="name@company.com"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
            />
          </div>
        </label>
        <label className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[#111418] dark:text-white text-sm font-medium leading-normal">
              Password
            </span>
            <a
              className="text-primary text-sm font-medium hover:underline"
              onClick={() => onSwitch("changePassword")}
            >
              Forgot password?
            </a>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-4 material-symbols-outlined text-[#617589] dark:text-[#9aa0a6] text-[20px]">
              lock
            </span>
            <input
              className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbe0e6] dark:border-[#3e4856] bg-white dark:bg-[#111418] focus:border-primary h-12 placeholder:text-[#617589] dark:placeholder:text-[#6e7781] py-2 pl-11 pr-10 text-sm font-normal leading-normal transition-all"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              className="absolute right-3 flex items-center justify-center text-[#617589] dark:text-[#9aa0a6] hover:text-[#111418] dark:hover:text-white transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                visibility
              </span>
            </button>
          </div>
        </label>
        <button
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm mt-2"
          type="submit"
        >
          <span className="truncate">Log In</span>
        </button>
      </form>
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-[#e5e7eb] dark:border-[#2a3441]"></div>
        <span className="flex-shrink-0 mx-4 text-[#617589] dark:text-[#9aa0a6] text-xs font-medium uppercase">
          Or continue with
        </span>
        <div className="flex-grow border-t border-[#e5e7eb] dark:border-[#2a3441]"></div>
      </div>
      <div
        onClick={() => handleSocialLogin("Kakao")}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button className="flex-1 flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-[#111418] border border-[#dbe0e6] dark:border-[#3e4856] text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#f8f9fa] dark:hover:bg-[#2a3441] transition-colors">
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          <span className="truncate">Kakao</span>
        </button>
        <button
          onClick={() => handleSocialLogin("google")}
          className="flex-1 flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-[#111418] border border-[#dbe0e6] dark:border-[#3e4856] text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#f8f9fa] dark:hover:bg-[#2a3441] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            account_circle
          </span>
          <span className="truncate">Google</span>
        </button>
        <button
          onClick={() => handleSocialLogin("Naver")}
          className="flex-1 flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-[#111418] border border-[#dbe0e6] dark:border-[#3e4856] text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#f8f9fa] dark:hover:bg-[#2a3441] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            account_circle
          </span>
          <span className="truncate">Naver</span>
        </button>
      </div>
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-[#e5e7eb] dark:border-[#2a3441]"></div>
        <span className="flex-shrink-0 mx-4 text-[#617589] dark:text-[#9aa0a6] text-xs font-medium uppercase">
          Or new To QRManual?
        </span>
        <div className="flex-grow border-t border-[#e5e7eb] dark:border-[#2a3441]"></div>
      </div>
      <button
        onClick={() => onSwitch("signup")}
        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-[#f0f2f4] dark:bg-[#2a3441] text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0e2e4] dark:hover:bg-[#3a4451] transition-colors"
      >
        <span className="truncate">Sign Up</span>
      </button>
    </div>
  );
};

export default LoginLeft;
