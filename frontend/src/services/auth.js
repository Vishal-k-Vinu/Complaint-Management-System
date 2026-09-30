import api from "./api";

export const login = async (username, password) => {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post(
    "/api/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
};

export const isAuthenticated = () => {
  return Boolean(
    localStorage.getItem("access_token")
  );
};