import { FiCreditCard, FiHome, FiList } from "react-icons/fi";

const steps = [
  { name: "Address", icon: FiHome },
  { name: "Payment method", icon: FiCreditCard },
  { name: "Review", icon: FiList },
];

export default function CheckoutProgress({ currentStep = 0 }: { currentStep?: number }) {
  return (
    <ol className="grid grid-cols-3" aria-label="Checkout progress">
      {steps.map(({ name, icon: Icon }, index) => (
        <li key={name} className="relative flex flex-col items-center text-center">
          {index < steps.length - 1 && <span className={`absolute left-1/2 top-5 h-px w-full ${index < currentStep ? "bg-brand-solid" : "bg-border"}`} aria-hidden="true" />}
          <span className={`relative z-10 grid size-10 place-items-center border ${index === currentStep ? "border-brand bg-brand-solid text-white" : index < currentStep ? "border-brand bg-card text-brand" : "border-border bg-card text-muted-foreground"}`}><Icon className="size-4" aria-hidden="true" /></span>
          <span className={`mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] sm:text-xs ${index === currentStep ? "text-brand" : "text-muted-foreground"}`}>{name}</span>
        </li>
      ))}
    </ol>
  );
}
