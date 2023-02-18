import { toast } from "react-toastify";

export const resolveImageURL = (path: string) => {
  console.log("this is image url " + path);

  if (path.startsWith("http")) return path;
  else if (path.length > 0)
    return `http://localhost:3000/images/questions/${path}`;
  else return "";
};

export const showSuccessToast = (message: string) => {
  toast.success(" " + message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};
export const showErrorToast = () => {
  toast.error("Something is wrong!", {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const hasEmpty = function (obj: any) {
  for (var key in obj) {
    if (obj[key] == null || obj[key] == "" || obj[key] == undefined)
      return true;
  }
  return false;
};
