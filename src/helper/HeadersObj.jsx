export const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      token: token || "",
    },
  };
};
