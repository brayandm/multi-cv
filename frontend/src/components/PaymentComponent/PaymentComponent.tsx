"use client";

interface IPaymentComponentProps {
  plan: string | null;
}

export default function PaymentComponent({ plan }: IPaymentComponentProps) {
  return <> {plan}</>;
}
