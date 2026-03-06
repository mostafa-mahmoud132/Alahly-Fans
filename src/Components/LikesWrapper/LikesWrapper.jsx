import React from "react";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getHeaders } from "../../helper/HeadersObj";
import Skeleton from "react-loading-skeleton";

export default function LikesWrapper({ isOpen, handleClose, postId }) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["postLikes", postId],
    queryFn: getPostLikes,
    enabled: Boolean(postId),
  });

  async function getPostLikes() {
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/likes?page=1&limit=20`,
        getHeaders(),
      );
      return data.data;
    } catch (err) {
      throw err;
    }
  }

  return (
    <Drawer
      className="bg-white"
      open={isOpen}
      onClose={handleClose}
      position="bottom"
    >
      <DrawerHeader
        title="Likes"
        titleClassName="text-xl font-bold text-gray-900"
        className="border-b border-gray-200 px-6 py-4"
      />
      <DrawerItems className="flex flex-col h-full overflow-hidden px-0 pb-0">
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {isLoading && <Skeleton count={5} width={"100%"} height={60} />}
          {isFetched && data?.likes?.length === 0 && (
            <p className="text-center text-gray-500 py-8">No likes yet.</p>
          )}
          {isFetched &&
            data?.likes?.map((user) => (
              <div key={user._id || user} className="flex items-center gap-3">
                <img
                  src={user.photo || "https://via.placeholder.com/40"}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">
                  {user.name || user}
                </span>
              </div>
            ))}
        </div>
      </DrawerItems>
    </Drawer>
  );
}
