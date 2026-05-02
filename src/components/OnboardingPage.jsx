import { useState } from "react";
import AutomationFlow from "./AutomationFlow.jsx";
import CardStack from "./CardStack.jsx";
import Logo from "./Logo.jsx";

const STEPS = [
  {
    key: "step-1",
    title: "Automations",
    subtitle: "So we know who you are and can reach you on WhatsApp",
    formTitle: "Let's start with your name and number",
    formSubtitle: "So we know who you are and can reach you on WhatsApp",
  },
  {
    key: "step-2",
    title: "Connect channels",
    subtitle: "Plug WhatsApp, Instagram, and Linkedin into WeNext",
    formTitle: "Choose where to send messages",
    formSubtitle: "Pick the channels you want WeNext to publish to",
  },
  {
    key: "step-3",
    title: "Launch your first flow",
    subtitle: "Pick a template and go live in minutes",
    formTitle: "Pick a starting template",
    formSubtitle: "We'll prefill content based on your channel mix",
  },
];

export default function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const current = STEPS[Math.min(step, total - 1)];
  const isLastStep = step >= total - 1;

  const cards = STEPS.map((s) => ({
    key: s.key,
    content: <BrandCard title={s.title} subtitle={s.subtitle} />,
  }));

  const goNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setStep((v) => v + 1);
    }
  };
  const goPrev = () => setStep((v) => Math.max(v - 1, 0));

  return (
    <div className="relative min-h-screen bg-white">
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-[60px] pt-[50px]">
        <Logo className="h-[26px] w-auto" />
        <button
          type="button"
          className="rounded-[46px] border border-[#1EB677] px-[15px] py-[12px] text-[14px] font-medium text-[#1EB677] transition-colors hover:bg-[#ECFDF5]"
        >
          Help
        </button>
      </div>

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[670px_1fr]">
        {/* Left brand panel hosting the card stack */}
        <div className="m-[30px] flex items-center justify-center">
          <div className="relative w-full max-w-[600px]">
            <CardStack cards={cards} step={step} />
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex items-center justify-center px-[60px]">
          <div className="flex w-full max-w-[440px] flex-col gap-[50px]">
            <div className="flex flex-col gap-[20px]">
              <p
                className="bg-clip-text text-[14px] font-semibold text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(158deg, #01AA9A 2.47%, #1EB677 100%)",
                }}
              >
                Step {Math.min(step, total - 1) + 1} of {total}
              </p>
              <div className="flex flex-col gap-[5px] leading-none">
                <h2 className="text-[24px] font-semibold text-[#101828]">
                  {current.formTitle}
                </h2>
                <p className="text-[16px] font-medium text-[#9CA3AF]">
                  {current.formSubtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[20px]">
              <Field label="Full Name" placeholder="Enter your name" required />
              <Field
                label="Mobile Number"
                placeholder="+91 9876543210"
                required
                helper="Enter the mobile number linked to your WhatsApp"
              />
              <Field
                label="Email ID"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-[30px]">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 0}
                className="text-[14px] font-medium text-[#9CA3AF] disabled:opacity-50"
              >
                ‹ Previous
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-[46px] px-[15px] py-[12px] text-[14px] font-medium text-white shadow-[0_0_10px_rgba(1,170,154,0.5)]"
                style={{
                  backgroundImage:
                    "linear-gradient(99.59deg, #1EB677 2.47%, #01AA9A 100%)",
                }}
              >
                {isLastStep ? "Get started" : "Next ›"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandCard({ title, subtitle }) {
  return (
    <div
      className="overflow-hidden rounded-[15px] p-[65px] pt-[128px] text-white"
      style={{
        backgroundImage:
          "linear-gradient(92.93deg, #01AA9A 2.47%, #1EB677 100%)",
      }}
    >
      <div className="mb-10 flex flex-col gap-2.5 leading-none">
        <h1 className="text-[36px] font-semibold">{title}</h1>
        <p className="text-[16px] font-medium">{subtitle}</p>
      </div>
      <div className="flex justify-center">
        <AutomationFlow />
      </div>
    </div>
  );
}

function Field({ label, placeholder, required, helper }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[16px] font-semibold text-[#0F172B]">
        {label} {required && <span className="text-[#FF0100]">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="rounded-[100px] border border-[#EDF1F7] bg-[#FBFCFD] px-[21px] py-[16px] text-[14px] font-medium text-[#101828] placeholder:text-[#6A7282] focus:outline-none focus:border-[#1EB677]"
      />
      {helper && (
        <p className="text-[14px] font-medium text-[#9CA3AF]">{helper}</p>
      )}
    </div>
  );
}
