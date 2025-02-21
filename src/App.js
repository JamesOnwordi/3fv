import "./App.css";
import axios from "axios";
import React, { useState } from "react";

function App() {
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [email, setEmail] = useState("");
  const [inputPhoneCode, setInputPhoneCode] = useState("");
  const [inputEmailCode, setInputEmailCode] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Dynamic phone number input
  const [loading, setLoading] = useState(false); // For loading states

  const generateCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const API_URL = "https://threefv-server.onrender.com"
  
  const handleSendPhoneCode = async () => {
    const code = generateCode();
    setPhoneCode(code);
    setLoading(true);
    try {
      // Sending SMS through backend (Twilio API)
      await axios.post(`${API_URL}/send-sms`, {
        phone: phoneNumber,
        code,
      });
      alert("Verification code sent to your phone!");
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Failed to send SMS. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyPhone = () => {
    if (inputPhoneCode === phoneCode) {
      setPhoneVerified(true);
      alert("Phone verified successfully!");
    } else {
      alert("Incorrect phone code.");
    }
  };

  const handleSendEmailCode = async () => {
    const code = generateCode();
    setEmailCode(code);
    setLoading(true);
    try {
      // Send email verification code through backend
      await axios.post(`${API_URL}/send-email`, {
        email,
        code,
      });
      alert("Verification code sent to your email!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email verification code. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/verify-email`, {
        email,
        code: inputEmailCode,
      });
      if (response.data.success) {
        setEmailVerified(true);
        alert("Email verified successfully!");
      } else {
        alert("Invalid verification code.");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/verify-password`,
        {
          password,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setPasswordVerified(true);
        alert("Password verified successfully!");
      } else {
        alert("Invalid Password.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    if (newPassword.length > 0) {
      setPasswordReset(true);
      alert("Password reset successfully!");
    } else {
      alert("Password cannot be empty.");
    }
  };

  const handleDeltaVerification = () => {
    if (emailVerified && passwordReset) {
      alert("Delta verification complete! You may proceed.");
    } else {
      alert(
        "Delta verification failed. Ensure email and password reset are verified."
      );
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>3-Factor Verification System</h1>

      {/* Step 1: Phone Verification */}
      <div>
        <h2>Step 1: Phone Verification</h2>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button
          onClick={handleSendPhoneCode}
          disabled={phoneVerified || loading}
        >
          {loading ? "Sending..." : "Send Code to Phone"}
        </button>
        {!phoneVerified && (
          <>
            <input
              type="text"
              placeholder="Enter phone code"
              value={inputPhoneCode}
              onChange={(e) => setInputPhoneCode(e.target.value)}
            />
            <button onClick={handleVerifyPhone} disabled={loading}>
              Verify Phone
            </button>
          </>
        )}
        {phoneVerified && <p>Phone verified ✅</p>}
      </div>

      {/* Step 2: Email Verification */}
      {phoneVerified && (
        <div>
          <h2>Step 2: Email Verification</h2>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendEmailCode}
            disabled={emailVerified || loading}
          >
            {loading ? "Sending..." : "Send Code to Email"}
          </button>
          {!emailVerified && (
            <>
              <input
                type="text"
                placeholder="Enter email verification code"
                value={inputEmailCode}
                onChange={(e) => setInputEmailCode(e.target.value)}
              />
              <button onClick={handleVerifyEmail} disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </>
          )}
          {emailVerified && <p>Email verified ✅</p>}
        </div>
      )}

      {/* Step 3: Password Reset */}
      {emailVerified && (
        <div>
          <h2>Step 3: Password </h2>
          {!passwordVerified && (
            <>
              <input
                type="password"
                placeholder="Enter current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleVerifyPassword} disabled={loading}>
                Verify Password
              </button>
            </>
          )}
          {passwordVerified && <p>Password verified ✅</p>}
        </div>
      )}

      {/* Step 4: Password Reset */}
      {passwordVerified && (
        <div>
          <h2>Step 4: Password Reset</h2>
          {!passwordReset && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handlePasswordReset} disabled={loading}>
                Reset Password
              </button>
            </>
          )}
          {passwordReset && <p>Password reset ✅</p>}
        </div>
      )}

      {/* Step 5: Delta Verification */}
      {passwordReset && (
        <div>
          <h2>Step 4: Delta Verification</h2>
          <button onClick={handleDeltaVerification} disabled={loading}>
            Start
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
