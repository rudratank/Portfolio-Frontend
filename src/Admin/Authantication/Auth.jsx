import { useState, useEffect } from "react";
import login from "../../assets/Login.jpeg";
import axios from "axios";
import { toast } from "sonner";
import { userAppStore } from "@/store";
import { useNavigate, useLocation } from "react-router-dom";
import { LOGIN_ROUTE, VERIFY_OTP } from "@/lib/constant.js";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo, userinfo } = userAppStore();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [unlockCode, setUnlockCode] = useState("");
  const [showUnlockForm, setShowUnlockForm] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [serverStatus, setServerStatus] = useState("checking");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated and has valid user data
  useEffect(() => {
    if (userinfo && userinfo.id && userinfo.email && !userinfo.message) {
      const from = location.state?.from?.pathname || "/admin-dashboard";
      navigate(from, { replace: true });
    }
  }, [userinfo, navigate, location]);

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      console.log("Checking server status...");
      const HOST = LOGIN_ROUTE.split("/api/auth")[0];

      // First try the health endpoint with simplified headers
      const healthResponse = await axios.get(`${HOST}/api/auth/health`, {
        timeout: 5000,
        withCredentials: true,
      });

      if (healthResponse.data?.status === "online") {
        console.log("Server status: online (via health endpoint)");
        setServerStatus("online");
        return;
      }
    } catch (healthError) {
      console.log(
        "Health endpoint check failed, trying fallback...",
        healthError
      );

      // If health endpoint fails, try the global status endpoint
      try {
        const HOST = LOGIN_ROUTE.split("/api/auth")[0];
        const response = await axios.get(`${HOST}/api/status`, {
          timeout: 3000,
          withCredentials: true,
        });

        if (response.data?.status === "online") {
          setServerStatus("online");
          console.log("Server status: online (via /api/status)");
          return;
        }
      } catch (statusError) {
        console.error("Status endpoint check failed:", statusError);

        // Final fallback - try root endpoint
        try {
          await axios.get(`${HOST}/`, { timeout: 2000 });
          setServerStatus("online");
          console.log("Server status: online (via root endpoint)");
        } catch (rootError) {
          console.error("All server checks failed:", rootError);
          setServerStatus("offline");
          toast.error("Server appears to be offline. Please try again later.");
        }
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    // Check server status before attempting login
    if (serverStatus === "offline") {
      toast.error("Server is offline. Please check your connection.");
      return;
    }

    const data = { email: email.trim(), password: password };
    setLoading(true);

    console.log("Attempting login to:", LOGIN_ROUTE);
    console.log("Login data:", { email: data.email, password: "[HIDDEN]" });

    try {
      const response = await axios.post(LOGIN_ROUTE, data, {
        withCredentials: true,
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Login response:", response.data);

      if (response.data.otpRequired) {
        setShowOtpForm(true);
        toast.success("OTP has been sent to your email!");
        return;
      }

      // If no OTP required, set user info and navigate
      if (response.data.user && response.data.user.id) {
        setUserInfo(response.data.user);
        const from = location.state?.from?.pathname || "/admin-dashboard";
        navigate(from, { replace: true });
      } else {
        toast.error("Login response missing user data");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your internet connection.");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Server might be slow.");
      } else if (error.response?.status === 429) {
        toast.error("Too many requests. Please wait and try again.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.response?.status === 403) {
        // Account locked
        toast.error(error.response?.data?.message || "Account is locked");
        setShowUnlockForm(true);
      } else {
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setLoginAttempts((prevAttempts) => prevAttempts + 1);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    console.log("Verifying OTP for:", email);

    try {
      const response = await axios.post(
        VERIFY_OTP,
        { email: email.trim(), otp: otp.toString() },
        {
          withCredentials: true,
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("OTP verification response:", response.data);

      if (response.status === 200 && response.data.user) {
        toast.success("Login successful!");
        setUserInfo(response.data.user);

        // Navigate to the intended destination or admin dashboard
        const from = location.state?.from?.pathname || "/admin-dashboard";
        navigate(from, { replace: true });
      } else {
        toast.error("OTP verification response missing user data");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();

    if (!email || !unlockCode) {
      toast.error("Please enter your email and unlock code");
      return;
    }

    setLoading(true);
    console.log("Attempting to unlock account for:", email);

    try {
      const response = await axios.post(
        `${LOGIN_ROUTE}/unlock-account`,
        {
          email: email.trim(),
          unlockCode: unlockCode.trim(),
        },
        {
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Unlock response:", response.data);
      toast.success(response.data.message);
      setShowUnlockForm(false);
      setLoginAttempts(0); // Reset login attempts
    } catch (error) {
      console.error("Unlock error:", error);
      toast.error(error.response?.data?.message || "Failed to unlock account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 to-teal-400">
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-5xl overflow-hidden">
        <div className="flex-1 bg-gray-100 flex justify-center items-center p-0 m-0">
          <img
            src={login}
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 p-8 flex flex-col justify-center">
          {/* Server Status Indicator */}
          <div className="mb-4 text-sm">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                serverStatus === "online"
                  ? "bg-green-500"
                  : serverStatus === "offline"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></span>
            Server: {serverStatus}
            {serverStatus === "offline" && (
              <button
                onClick={checkServerStatus}
                className="ml-2 text-purple-500 hover:underline text-xs"
              >
                Retry
              </button>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {showOtpForm
              ? "Enter OTP"
              : showUnlockForm
              ? "Unlock Account"
              : "Login as an Admin User"}
          </h2>

          {!showOtpForm && !showUnlockForm ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="johndoe@xyz.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute top-3 right-4 text-gray-400">👤</span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute top-3 right-4 text-gray-400">🔒</span>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                disabled={loading || serverStatus === "offline"}
              >
                {loading ? "Please wait..." : "LOGIN"}
              </button>

              {loginAttempts >= 3 && (
                <button
                  type="button"
                  onClick={() => setShowUnlockForm(true)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
                >
                  Unlock Account
                </button>
              )}
            </form>
          ) : showOtpForm ? (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                OTP has been sent to your email: {email}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-lg tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "VERIFY OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOtpForm(false);
                  setOtp("");
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Enter your email and the unlock code to regain access.
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="johndoe@xyz.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Unlock Code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Unlocking..." : "UNLOCK"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUnlockForm(false);
                  setUnlockCode("");
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
              >
                Back to Login
              </button>
            </form>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <a href="/help-signin" className="hover:text-purple-500">
              Get help Signing in.
            </a>
          </div>
          <div className="space-x-2">
            <a href="/privacy" className="text-purple-500 hover:underline">
              Terms of use.
            </a>
            <a
              href="/terms-of-service"
              className="text-purple-500 hover:underline"
            >
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
