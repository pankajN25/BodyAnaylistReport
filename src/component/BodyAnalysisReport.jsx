import React, { useState } from "react";
import BodyAnalysisForm1 from "./BodyAnalysisForm1";
import BodyAnalysisForm2 from "./BodyAnalysisForm2";
import BodyAnalysisForm3 from "./BodyAnalysisForm3";

const BodyAnalysisReport = () => {
  const [form1, setForm1] = useState({});
  const [form2, setForm2] = useState({});
  const [step, setStep] = useState(1);

  const handleForm1Submit = (data) => {
    setForm1(data);
    setStep(2);
  };

  const handleForm2Submit = (data) => {
    setForm2(data);
    setStep(3);
  };

  const handleForm3Submit = async (data) => {
    const finalData = {
      form1,
      form2,
      form3: data,
    };

    console.log("Submitting:", finalData);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/submit-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit report");
      }

      const result = await res.json();
      alert("Report submitted successfully!");
      console.log(result);
    } catch (err) {
      console.error("Submit failed:", err.message);
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      {step === 1 && <BodyAnalysisForm1 onSubmit={handleForm1Submit} />}
      {step === 2 && <BodyAnalysisForm2 onSubmit={handleForm2Submit} />}
      {step === 3 && <BodyAnalysisForm3 onSubmit={handleForm3Submit} />}
    </div>
  );
};

export default BodyAnalysisReport;
