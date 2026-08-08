import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 2800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: "eco-toast eco-toast-success",
    progressClassName: "eco-toast-progress-success",
  });
};

export const handleError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 3200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: "eco-toast eco-toast-error",
    progressClassName: "eco-toast-progress-error",
  });
};

export const handleInfo = (msg) => {
  toast.info(msg, {
    position: "top-right",
    autoClose: 2800,
    className: "eco-toast eco-toast-info",
    progressClassName: "eco-toast-progress-info",
  });
};