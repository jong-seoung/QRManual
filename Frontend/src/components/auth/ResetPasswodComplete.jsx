const ResetPasswordComplete = ({ onSwitch }) => {
  return (
    <div className="relative flex flex-col flex-grow items-center justify-center p-4 sm:p-6 w-full max-w-[1200px] mx-auto z-10">
      <main className="w-full max-w-[480px]">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-[#e5e7eb] dark:border-[#2a3441] overflow-hidden">
          <div className="flex flex-col items-center px-8 pt-10 pb-8 text-center">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-[bounce_1s_ease-out_1]">
              <span className="material-symbols-outlined text-[40px]">
                check_circle
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 mb-8">
              <h1 className="text-[#111418] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                Password Reset Complete
              </h1>
              <p className="text-[#617589] dark:text-[#94a3b8] text-sm font-normal leading-relaxed max-w-[360px]">
                Your password has been successfully updated. You can now use
                your new password to sign in to your account.
              </p>
            </div>
            <button
              onClick={() => onSwitch("login")}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary hover:bg-[#1170d2] transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm"
            >
              <span className="truncate">Sign In</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordComplete;
