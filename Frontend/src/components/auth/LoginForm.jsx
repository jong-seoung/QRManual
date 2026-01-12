import LoginRight from "./LoginRight";
import LoginLeft from "./LoginLeft";

const Login = ({ onSwitch }) => {
  return (
    <div className="layout-container flex h-full grow flex-col justify-center items-center py-5 mt-15">
      <div className="px-4 md:px-40 flex flex-1 justify-center w-full">
        <div className="layout-content-container flex flex-col max-w-[1000px] flex-1">
          <div className="bg-white dark:bg-[#1a222c] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] overflow-hidden flex flex-col md:flex-row h-full min-h-[600px]">
            <LoginLeft onSwitch={onSwitch} />
            <LoginRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
