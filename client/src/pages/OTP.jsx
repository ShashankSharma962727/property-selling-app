
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import api from "../API/api";
import { useNavigate } from "react-router-dom";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const inputClass =
    "w-full rounded-sm border border-cream-200 bg-cream-50 px-4 py-3 text-sm tracking-widest text-navy-950 outline-none transition-colors placeholder:text-navy-950/40 focus:border-amber-500";

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post(
        "/api/v1/auth/verify-email",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Account verification successfully!");
      if (res.data.success) {
        navigate("/dashboard/profile");
      }
    } catch (error) {
      setError(
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-cream-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">

        {/* Heading */}
        <div className="mb-8">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-600">
            Account Security
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
            Verify Account<span className="text-amber-500">.</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-navy-950/60">
            Enter the verification code sent to your registered email
            address to verify your account.
          </p>
        </div>

        {/* OTP Card */}
        <section className="rounded-sm border border-cream-200 bg-white p-5 sm:p-7">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-amber-500 text-navy-950">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v2h8z"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-navy-950">
                Email Verification
              </h2>
              <p className="text-xs text-navy-950/55">
                One-time password required
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify}>
            <div className="mb-5">
              <label
                htmlFor="otp"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-950/55"
              >
                Enter OTP
              </label>

              <input
                id="otp"
                type="text"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                placeholder="Enter 6-digit OTP"
                className={inputClass}
                required
              />
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-sm bg-amber-500 px-5 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </form>

          <div className="mt-6 border-t border-cream-200 pt-5">
            <p className="text-center text-xs leading-5 text-navy-950/55">
              Didn't receive the code? Please check your email
              inbox and spam folder.
            </p>
          </div>

        </section>

        <p className="mt-5 text-center text-xs text-navy-950/40">
          Secure Account Verification
        </p>

      </div>
    </div>
  );
};

export default OTP;
