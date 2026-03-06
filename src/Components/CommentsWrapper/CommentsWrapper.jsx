import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useState } from "react";
import { getHeaders } from "../../helper/HeadersObj";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import AddComment from "../AddComment/AddComment";
import Comment from "../Comment/Comment";

export default function CommentsWrapper({
  isOpen,
  setIsOpen,
  handleClose,
  activePostId,
}) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["postComments", activePostId],
    queryFn: getPostComments,
    enabled: Boolean(activePostId),
  });
  const [commentToBeUpdate, setUpdatedComment] = useState();

  async function getPostComments() {
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/posts/${activePostId}/comments?page=1&limit=10`,
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
        className="border-b border-gray-200 px-6 py-4 text-xl font-bold text-gray-900"
      >
        Comments
      </DrawerHeader>

      <DrawerItems className="flex flex-col h-full overflow-hidden px-0 pb-0">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {isLoading && <Skeleton count={5} width={"100%"} height={60} />}
          {isFetched && data?.comments?.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
          {isFetched &&
            data?.comments?.map((comment) => (
              <Comment
                setUpdatedComment={setUpdatedComment}
                key={comment._id}
                comment={comment}
                activePostId={activePostId}
              />
            ))}
        </div>

        <AddComment
          commentToBeUpdate={commentToBeUpdate}
          activePostId={activePostId}
        />
      </DrawerItems>
    </Drawer>
  );
}