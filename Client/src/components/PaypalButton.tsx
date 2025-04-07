import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useAppContext } from "../contexts/AppContext.tsx";
import axios from "axios";

interface PaypalButtonProps {
  amount: string;
  invoice: string;
  itemId: string;
}

const PaypalButton: React.FC<PaypalButtonProps> = (props) => {
  const { setModalPaymentOpen, setIsSuccess } = useAppContext();
  const { session } = useAppContext();

  const handlePaymentSuccess = () => {
    setModalPaymentOpen(true);
    setIsSuccess(true);
  };

  const handlePaymentError = () => {
    setModalPaymentOpen(true);
    setIsSuccess(false);
  };

  const createOrder = (data: any, actions: any) => {
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

  const onApprove = async (data: any, actions: any) => {
    console.log("onApprove data: ", data);
    const order = await actions.order?.capture();
    console.log("order: ", order);
    if (order.status === "COMPLETED") {
      console.log("Payment successful!", order);
      console.log("el usuario:", session?.username, " ha pagado el pronostico con id: ", props.itemId);
      axios
        .post(
          `${import.meta.env.VITE_URL_SERVER}/purchase`,
          {
            userId: session?.id,
            payerFullName: order.payer.name,
            productId: props.itemId,
            orderId: order.id,
            status: order.status,
            value: props.amount,
            purchaseDate: order.create_time,
          },
          { withCredentials: true }
        )
        .then((response) => {
          console.log("Purchase successful:", response.data);
          handlePaymentSuccess();
        })
        .catch((error) => {
          console.error("Error during purchase:", error);
          handlePaymentError();
        });
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
