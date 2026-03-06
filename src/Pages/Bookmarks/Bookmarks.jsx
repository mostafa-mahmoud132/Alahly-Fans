import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePosts from "../../customHooks/usePosts";
import PostCard from "../../Components/postCard/postCard";
import PostCardLoadingSkeleton from "../../Components/postCard/PostCardSkeleton/PostCardSkeleton";
import CommentsWrapper from "../../Components/CommentsWrapper/CommentsWrapper";
import LikesWrapper from "../../Components/LikesWrapper/LikesWrapper";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa";

export default function Bookmarks() {
  const { data, isLoading, isError, isFetching, isFetched } = usePosts(
    ["bookmarkedPosts"],
    true,
    "users/bookmarks",
  );

  console.log("Bookmarks Data:", data);
  const posts = data?.posts || data?.bookmarks || data || [];
  const finalPosts = Array.isArray(posts) ? posts : (posts.bookmarks || []);

  const [activePostId, setActivePostId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [postToBeUpdate, setPostToBeUpdate] = useState(null);

  const [likesOpen, setLikesOpen] = useState(false);
  const [activeLikesPostId, setActiveLikesPostId] = useState(null);

  return (
    <>
      <title>Bookmarks</title>
      <div className="bg-gray-100 min-h-screen py-6 mt-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-2xl shadow-sm">
            <div className="p-3 bg-blue-50 text-[#1f6fe5] rounded-xl">
              <FaBookmark size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Bookmarks</h1>
              <p className="text-sm text-slate-500">Your saved posts are listed here.</p>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4">
              <PostCardLoadingSkeleton />
              <PostCardLoadingSkeleton />
              <PostCardLoadingSkeleton />
            </div>
          )}

          {isFetched && finalPosts.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBookmark size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-lg font-medium">
                No bookmarked posts yet.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Save posts you want to revisit later.
              </p>
            </div>
          )}

          {isFetched &&
            finalPosts.map((post) => (
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
