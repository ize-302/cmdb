import React from "react";
import { Toaster } from "react-hot-toast";

const CustomToast = () => {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            padding: "5px 10px",
            fontSize: "10px",
            color: "#3A3737",
            background: "#1d2230",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "4px",
          },
          success: {
            style: {
              color: "#A5E294",
            },
          },
          error: {
            style: {
              color: "#F34D4F",
            },
          },
        }}
      />
    </>
  );
};

export default CustomToast;
