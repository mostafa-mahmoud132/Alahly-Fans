import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { getHeaders } from "../helper/HeadersObj";
import { AuthContext } from "../Context/AuthContext";

export default function usePosts(queryKey, isEnabled, endPoint) {
  const { token } = useContext(AuthContext);

  const { data, isLoading, isError, isFetching, isFetched } = useQuery({
    queryFn: getPosts,
    queryKey: [...queryKey, token],
    enabled: isEnabled && !!token,
  });

  async function getPosts() {
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/${endPoint}`,
        getHeaders(),
      );
      return data.data;
    } catch (err) {
      console.error("Error fetching posts:", err);
      return err;
    }
  }

  return { data, isLoading, isError, isFetching, isFetched };
}
