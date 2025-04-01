import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useAppContext } from "../contexts/AppContext.tsx";

interface PaypalButtonProps {
  amount: string;
  invoice: string;
}

const PaypalButton: React.FC<PaypalButtonProps> = (props) => {

  const { setModalPaymentOpen, setIsSuccess } = useAppContext();

  const handlePaymentSuccess = () => {
    setModalPaymentOpen(true);
    setIsSuccess(true);
  }

  const handlePaymentError = () => {
    setModalPaymentOpen(true);
    setIsSuccess(false);
  }

  const createOrder = (data :any, actions: any) => {
    console.log("createOrder data: ", data);
    return actions.order.create({
      purchase_units: [
        {
          description: props.invoice,
          amount: {
            value: props.amount,
          },
        },
      ],
    });
  };


  const onApprove = async(data :any, actions: any) => {
    console.log("onApprove data: ", data);
    const order = await actions.order?.capture();
    console.log("order: ", order);
    if (order.status === "COMPLETED") {
      handlePaymentSuccess();
      console.log("Payment successful!", order);
    } else {
      handlePaymentError();
    }
  };

  const onError = (err: any) => {
    console.error("PayPal Checkout onError", err);
    handlePaymentError();
  };

  return (
    <PayPalButtons
      style={{ layout: "horizontal", color: "gold", shape: "pill", label: "buynow" }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
};

export default PaypalButton;