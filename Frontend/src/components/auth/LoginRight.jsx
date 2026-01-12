const LoginRight = ({ onSwitch }) => {
  return (
    <div className="hidden md:block w-1/2 bg-[#f0f2f4] dark:bg-[#111418] relative overflow-hidden group">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        data-alt="Abstract 3D blue blocks security concept illustration"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNskC9iPIVZ0L9j_aALs5r9-8qzmwOa26P0nNnQhR7nKKa1WkUV9JJVbl46FfWFEFPhcLuFUgT_oVfSUdkomleNgD7dmmOEYCA1McZrdl9qPDbhuIL0uPFnsRan7d3bvDbd46oPS3QEIt0ZHFM8Le5ltSEB_cWWUezLrtYFV5bsLqAjRMWLrmuB587PBG_IyP_nCQNmrzpeDX662c3ijxVdHuNMLua6SeOAeVLo7m1ZCV439LGTsP4HbrAMKhABjVSXvP6bP70L4w")`,
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40 mix-blend-multiply"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
        <div className="size-16 mb-6 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
          <span className="material-symbols-outlined text-4xl">
            qr_code_scanner
          </span>
        </div>
        <h3 className="text-3xl font-bold mb-3 leading-tight">
          Secure &amp; Organized Documentation
        </h3>
        <p className="text-white/90 text-sm font-medium leading-relaxed max-w-sm">
          Access your product manuals, technical specs, and QR code inventory
          from anywhere in the world.
        </p>
      </div>
    </div>
  );
};

export default LoginRight;
