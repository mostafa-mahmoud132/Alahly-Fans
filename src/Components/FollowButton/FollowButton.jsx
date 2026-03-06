import React, { useContext } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import { getHeaders } from "../../helper/HeadersObj";
import toast from "react-hot-toast";


export default function FollowButton({ userId, isInitialFollowing, className = "" }) {
  const { userData, token } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const isSelf = userData?._id === userId;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        getHeaders()
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["postLikes"] });
      queryClient.invalidateQueries({ queryKey: ["postCommentsList"] });
      queryClient.invalidateQueries({ queryKey: ["loggedUser"] });    
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["userConnections"] });
      queryClient.invalidateQueries({ queryKey: ["userFollowers", userId] });
      queryClient.invalidateQueries({ queryKey: ["userFollowing"] });
      toast.success(isInitialFollowing ? "Unfollowed successfully" : "Followed successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update follow status");
    },
  });

  if (!token || isSelf) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        mutate();
      }}
      disabled={isPending}
      className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 ${
        isInitialFollowing
          ? "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200"
          : "bg-[#1f6fe5] text-white hover:bg-blue-600 shadow-sm"
      } ${isPending ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
    >
      {isPending ? "..." : isInitialFollowing ? "Following" : "Follow"}
    </button>
  );
}
