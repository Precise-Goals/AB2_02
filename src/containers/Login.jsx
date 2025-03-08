import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    // Reset error
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // For sign up, check if passwords match
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login - navigate to the UI builder
      navigate("/unifusion-ui-builder");
    } catch (error) {
      console.error("Sign-in error:", error);

      // Handle different Firebase auth errors
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/too-many-requests":
          setError("Too many failed login attempts. Please try again later");
          break;
        default:
          setError("Failed to sign in. Please check your credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Successful registration - navigate to the UI builder
      navigate("/unifusion-ui-builder");
    } catch (error) {
      console.error("Sign-up error:", error);

      // Handle different Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        default:
          setError("Failed to create account. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setError("");
      alert("Password reset email sent. Please check your inbox");
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Create an Account" : "Sign In to UniFusion"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div
                style={{
                  background: "black",
                  color: "white",
                  fontSize: "20px",
                  textAlign: "center",
                }}
              >
                {" "}
                "Processing..."
              </div>
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {!isSignUp && (
          <div className="mt-4 text-center">
            <button
              onClick={handleForgotPassword}
              className="text-blue-600 hover:text-blue-800 text-sm"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-blue-600 hover:text-blue-800"
            disabled={loading}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
