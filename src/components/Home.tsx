import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="w-screen h-screen m-auto flex flex-col items-center justify-center bg-gradient-to-bl from-slate-200 to-slate-400">
      <div className="flex flex-row items-center justify-center">
        <h1 className="text-4xl font-black">KALINDU AUTO</h1>
        <sup>By</sup>
        <h4>DevX10</h4>
      </div>
      <div
        className="inline-block h-8 w-8 mt-10 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
