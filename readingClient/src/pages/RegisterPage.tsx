import { useState, useRef } from "react";
import { register, requestOtp } from "../services/auth.api";
import { useNavigate, Link } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const inputsRef = useRef<HTMLInputElement[] >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      requestOtp(email);
      setIsOtpModalOpen(true);
    } catch (err) {
      alert("Failed to request OTP");
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // chỉ cho nhập số
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Nếu đã nhập đủ 6 số thì tự động submit
    if (newOtp.every((digit) => digit !== "")) {
      handleConfirmOtp(newOtp.join(""));
    }
  };

  const handleConfirmOtp = async (otp: string) => {
    try {
      await register(username, email, password, otp);
      alert("Register successfully!");
      navigate("/login");
    } catch (err) {
      alert("Register failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      await requestOtp(email);
      alert("OTP has been resent to your email");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold text-deep-space-blue-800 mb-4">
        Register
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white p-3 rounded"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-ocean-blue-600">
          Login
        </Link>
      </p>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsOtpModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-96 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-center">Enter OTP</h2>

            {/* 6 ô nhập OTP */}
            <div className="flex justify-center gap-2">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    if (el) {
                      inputsRef.current[idx] = el;
                    }
                  }}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg border rounded focus:ring-2 focus:ring-ocean-blue-500"
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleResendOtp}
                className="text-sm text-ocean-blue-600 hover:underline"
              >
                Resend OTP
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOtpModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmOtp(otpValues.join(""))}
                  className="px-4 py-2 bg-ocean-blue-500 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};