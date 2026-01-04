import { useState } from "react";
import useAuthStore from "../../store/authStore";

const SignupForm = ({ onSwitch }) => {
  const { register, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    Role: "ROLE_USER",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    e.preventDefault();
    try {
      await register(formData);
      onSwitch("emailVerification", { email: formData.email });
    } catch (err) {
      console.error(err);
    }
  };

  const isFormValid =
    formData.email &&
    formData.fullName &&
    formData.address &&
    formData.username &&
    formData.password;

  return (
    <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-[640px] flex flex-col gap-6">
        {/* <!-- Registration Card --> */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6 sm:p-8 flex flex-col gap-6"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111418] dark:text-white">
            Create your account
          </h1>
          {/* <!-- Row 1: Name & Username --> */}
          <div className="flex flex-col sm:flex-row gap-5">
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-200">
                Full Name
              </span>
              <div className="relative">
                <input
                  className="form-input w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-[#617589] dark:placeholder:text-gray-500 text-base transition-colors"
                  name="fullName"
                  placeholder="John Doe"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">
                  person
                </span>
              </div>
            </label>
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-200">
                Username
              </span>
              <div className="relative">
                <input
                  className="form-input w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-[#617589] dark:placeholder:text-gray-500 text-base transition-colors"
                  name="username"
                  placeholder="jdoe123"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">
                  alternate_email
                </span>
              </div>
            </label>
          </div>
          {/* <!-- Row 2: Email --> */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-200">
              Email Address
            </span>
            <div className="relative">
              <input
                className="form-input w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-[#617589] dark:placeholder:text-gray-500 text-base transition-colors"
                placeholder="name@company.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">
                mail
              </span>
            </div>
          </label>
          {/* <!-- Row 3: Address --> */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-200">
              Mailing Address
            </span>
            <div className="relative">
              <input
                className="form-input w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-[#617589] dark:placeholder:text-gray-500 text-base transition-colors"
                placeholder="123 Main St, City, Country"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">
                home_pin
              </span>
            </div>
          </label>
          {/* <!-- Row 4: Password & Confirm --> */}
          <div className="flex flex-col sm:flex-row gap-5">
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-200">
                Password
              </span>
              <div className="relative group">
                <input
                  className="form-input w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 pr-10 placeholder:text-[#617589] dark:placeholder:text-gray-500 text-base transition-colors"
                  placeholder="Min. 8 characters"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    visibility
                  </span>
                </button>
              </div>
            </label>
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-200">
                Confirm Password
              </span>
              <div className="relative group">
                <input
                  className="form-input w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 pr-10 placeholder:text-[#617589] dark:placeholder:text-gray-500 text-base transition-colors"
                  placeholder="Retype password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    visibility_off
                  </span>
                </button>
              </div>
            </label>
          </div>
          {/* <!-- Company Toggle --> */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-background-light dark:bg-gray-800/50 border border-transparent hover:border-[#dbe0e6] dark:hover:border-gray-700 transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#111418] dark:text-white">
                Company Account
              </span>
              <span className="text-xs text-[#617589] dark:text-gray-400">
                Register this account for your organization
              </span>
            </div>
            <label classNameName="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isCompany"
                checked={formData.Role === "ROLE_COMPANY"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Role: e.target.checked ? "ROLE_COMPANY" : "ROLE_USER",
                  })
                }
                classNameName="w-4 h-4"
              />
              <span classNameName="text-sm text-gray-700 dark:text-gray-300">
              </span>
            </label>
          </div>
          {/* <!-- Submit Button --> */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white text-base font-bold rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-primary/20"
            >
              <span>Register</span>
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="text-center">
            <a
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => onSwitch("login")}
            >
              Already have an account? Log in
            </a>
          </div>
          {/* <!-- Terms --> */}
          <p className="text-xs text-center text-[#617589] dark:text-gray-500 mt-2">
            By registering, you agree to our{" "}
            <a className="text-primary hover:underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignupForm;
