import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePosts from "../../customHooks/usePosts";
import PostCard from "../../Components/postCard/postCard";
import PostCardLoadingSkeleton from "../../Components/postCard/PostCardSkeleton/PostCardSkeleton";
import AddPost from "../../Components/AddPost/AddPost";
import CommentsWrapper from "../../Components/CommentsWrapper/CommentsWrapper";
import LikesWrapper from "../../Components/LikesWrapper/LikesWrapper";
import { useState } from "react";

export default function Posts() {
  const { data, isLoading, isError, isFetching, isFetched } = usePosts(
    ["allPosts"],
    true,
    "posts?limit=50&sort=-createdAt",
  );

  const [activePostId, setActivePostId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [postToBeUpdate, setPostToBeUpdate] = useState(null);

  const [likesOpen, setLikesOpen] = useState(false);
  const [activeLikesPostId, setActiveLikesPostId] = useState(null);

  return (
    <>
      <title>Posts</title>
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-2xl mx-auto px-4">
          <AddPost postToBeUpdate={postToBeUpdate} />

          {isLoading && (
            <div className="space-y-4">
              <PostCardLoadingSkeleton />
              <PostCardLoadingSkeleton />
              <PostCardLoadingSkeleton />
            </div>
          )}

          {isFetched && data?.posts?.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">
                No posts yet. Be the first to post!
              </p>
            </div>
          )}

          {isFetched &&
            data?.posts?.map((post) => (
              <PostCard
                post={post}
                key={post._id}
                setIsOpen={setIsOpen}
                setActivePostId={setActivePostId}
                activePostId={activePostId}
                setPostToBeUpdate={setPostToBeUpdate}
                setLikesOpen={setLikesOpen}
                setActiveLikesPostId={setActiveLikesPostId}
              />
            ))}
        </div>
      </div>
      <CommentsWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClose={handleClose}
        activePostId={activePostId}
      />
      <LikesWrapper
        isOpen={likesOpen}
        handleClose={() => setLikesOpen(false)}
        postId={activeLikesPostId}
      />
    </>
  );
}
