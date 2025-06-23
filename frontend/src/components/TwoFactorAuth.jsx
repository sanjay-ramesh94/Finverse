import { useState } from "react";
import RequestOTP from "./RequestOTP";
import VerifyOTP from "./VerifyOTP";

export default function TwoFactorAuth() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <div>
      {step === 1 && <RequestOTP onNext={(email) => { setEmail(email); setStep(2); }} />}
      {step === 2 && <VerifyOTP email={email} onVerified={() => alert("✅ Auth Success")} />}
    </div>
  );
}
