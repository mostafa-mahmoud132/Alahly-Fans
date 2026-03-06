import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { getHeaders } from "../helper/HeadersObj";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(); 
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const { data: profileQueryData } = useQuery({
    queryKey: ["loggedUser"],
    queryFn: async () => {
      if (!token) return null;
      const { data } = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        getHeaders(),
      );
      return data.data.user;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (profileQueryData) {
      setUserData(profileQueryData);
    }
  }, [profileQueryData]);

  return (
    <AuthContext.Provider value={{ token, setToken, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

