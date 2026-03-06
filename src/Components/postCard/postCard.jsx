import React, { useState, useContext } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaShare, FaTrash, FaEdit } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { getHeaders } from "../../helper/HeadersObj";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import InteractionModal from "../InteractionModal/InteractionModal";
import ShareModal from "../ShareModal/ShareModal";

export default function PostCard({
  post,
  setIsOpen,
  setActivePostId,
  activePostId,
  setPostToBeUpdate,
}) {
  const navigate = useNavigate();
  const {
    body,
    createdAt: postDate,
    _id: postId,
    image: postImage,
    isShare,
    sharedPost,
    sharesCount,
    bookmarked,
  } = post;
  const { name, photo: userImage, _id: userId } = post.user || {};
  const { userData } = useContext(AuthContext);
  const result = formatDistanceToNow(new Date(postDate), { addSuffix: true });
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  // Custom Modals State
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Fetch likes data
  const {
    data: likesData = { likes: [], likeCount: 0 },
    isLoading: isLoadingLikes,
  } = useQuery({
    queryKey: ["postLikes", postId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/posts/${postId}/likes?page=1&limit=50`,
          getHeaders(),
        );
        return {
          likes: data.data?.likes || [],
          likeCount: data.data?.likeCount || data.data?.likes?.length || 0,
        };
      } catch (err) {
        return { likes: [], likeCount: 0 };
      }
    },
  });

  // Fetch comments specific data for list
  const { data: commentsList = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ["postCommentsList", postId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=50`,
          getHeaders(),
        );
        // Extract unique user objects from comments
        const allComments = data?.data?.comments || data?.data || [];
        const uniqueUsers = Array.from(
          new Map(
            allComments.map((c) => [c.commentCreator?._id, c.commentCreator]),
          ).values(),
        ).filter(Boolean);
        return uniqueUsers;
      } catch (err) {
        return [];
      }
    },
    enabled: isCommentsModalOpen,
  });

  // Fetch comments count
  const { data: commentsCount = 0 } = useQuery({
    queryKey: ["postCommentsCount", postId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/posts/${postId}/comments`,
          getHeaders(),
        );
        const comments = data?.data?.comments || data?.data || [];
        return data?.totalCount || comments.length || 0;
      } catch (err) {
        return 0;
      }
    },
  });

  const userHasLiked = likesData.likes?.some(
    (like) => like._id === userData?._id || like === userData?._id,
  );

  // Delete Post Mutation
  const { mutate: deleteMutate, isPending } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
      toast.success("Post deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting post.");
    },
  });

  // Like Post Mutation
  const { mutate: likeMutate, isPending: isLiking } = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postLikes", postId] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
    },
    onError: () => {
      toast.error("Error toggling like");
    },
  });

  // Share Post Mutation
  const { mutate: shareMutate, isPending: isSharing } = useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
      toast.success("Post shared successfully!");
      setIsShareModalOpen(false);
    },
    onError: () => {
      toast.error("Error sharing post.");
    },
  });

  // Bookmark Post Mutation
  const { mutate: bookmarkMutate, isPending: isBookmarking } = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
      toast.success(
        bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      );
    },
    onError: () => {
      toast.error("Error bookmarking post.");
    },
  });

  async function deletePost() {
    await axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}`,
      getHeaders(),
    );
  }

  async function toggleLike() {
    await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/like`,
      {},
      getHeaders(),
    );
  }

  async function sharePost(shareBody) {
    await axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/share`,
      { body: shareBody || "Check out this post!" },
      getHeaders(),
    );
  }

  async function toggleBookmark() {
    await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
      {},
      getHeaders(),
    );
  }

  function handelClick() {
    setActivePostId(postId);
    setIsOpen(true);
  }

  const { register, handleSubmit } = useForm({
    defaultValues: { body: post.body, image: null },
  });

  async function updatePost(values) {
    const formData = new FormData();
    formData.append("body", values.body);
    if (values.image) formData.append("image", values.image[0]);

    await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      formData,
      getHeaders(),
    );

    queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    queryClient.invalidateQueries({ queryKey: ["profailPosts"] });

    toast.success("Post updated successfully");
    setIsEditing(false);
  }

  const reactions = [
    { emoji: "👍", label: "Like" },
    { emoji: "❤️", label: "Love" },
    { emoji: "😂", label: "Haha" },
    { emoji: "😮", label: "Wow" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😠", label: "Angry" },
  ];

  function handleCardClick(e) {
    const excludedTags = [
      "BUTTON",
      "A",
      "INPUT",
      "TEXTAREA",
      "svg",
      "path",
      "DIV",
    ];
    if (excludedTags.includes(e.target.tagName)) return;
    navigate(`/postDetails/${postId}`);
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition cursor-pointer"
                src={userImage}
                alt={name}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    userId === userData?._id ? "/profail" : `/user/${userId}`,
                  );
                }}
              />
              <div className="flex-1">
                <p
                  className="font-bold text-gray-900 hover:text-[#1f6fe5] transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      userId === userData?._id ? "/profail" : `/user/${userId}`,
                    );
                  }}
                >
                  {name}
                </p>
                <p className="text-sm text-gray-500">{result}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  bookmarkMutate();
                }}
                disabled={isBookmarking}
                className={`p-2 hover:bg-gray-100 rounded-full transition ${bookmarked ? "text-yellow-500" : "text-gray-400"}`}
                title="Bookmark"
              >
                <svg
                  fill={bookmarked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </button>
              {userId === userData?._id && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition text-blue-500"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutate();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition text-red-500"
                    title="Delete"
                  >
                    {isPending ? "..." : <FaTrash size={18} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(updatePost)} className="p-4 space-y-3">
            <textarea
              defaultValue={post.body}
              {...register("body")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <input
              type="file"
              {...register("image")}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Save
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {body && (
              <div className="px-4 pt-4">
                <p className="text-gray-900 text-base leading-relaxed">
                  {body}
                </p>
              </div>
            )}

            {isShare && sharedPost && (
              <div
                className="mx-4 my-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/postDetails/${sharedPost._id}`);
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={sharedPost.user?.photo}
                    alt={sharedPost.user?.name}
                  />
                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      {sharedPost.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sharedPost.createdAt
                        ? formatDistanceToNow(new Date(sharedPost.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </p>
                  </div>
                </div>
                {sharedPost.body && (
                  <p className="text-gray-800 text-sm mb-3">
                    {sharedPost.body}
                  </p>
                )}
                {sharedPost.image && (
                  <img
                    className="w-full h-64 object-cover rounded-lg"
                    src={sharedPost.image}
                    alt="Shared Post Content"
                  />
                )}
              </div>
            )}

            {!isShare && postImage && (
              <img
                className="w-full h-96 object-cover my-3 cursor-pointer"
                src={postImage}
                alt="Post"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/postDetails/${postId}`);
                }}
              />
            )}
          </>
        )}

        {!isEditing && (
          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 flex items-center justify-between">
            <div className="flex gap-3">
              {likesData.likeCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLikesModalOpen(true);
                  }}
                  className="hover:underline font-semibold text-[#1f6fe5] cursor-pointer flex items-center gap-1"
                >
                  <AiFillLike className="text-[#1f6fe5]" />
                  {likesData.likeCount}{" "}
                  {likesData.likeCount === 1 ? "like" : "likes"}
                </button>
              )}

              {sharesCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-gray-600">
                  <FaShare size={12} />
                  {sharesCount} {sharesCount === 1 ? "share" : "shares"}
                </span>
              )}
            </div>

            
            {commentsCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCommentsModalOpen(true);
                }}
                className="hover:underline font-semibold text-gray-700 cursor-pointer"
              >
                {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
              </button>
            )}
          </div>
        )}

    
        {!isEditing && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-gray-500">
      
            <div className="flex-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  likeMutate();
                }}
                disabled={isLiking}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded transition font-semibold ${
                  userHasLiked ? "text-blue-500 bg-blue-50" : "text-gray-600"
                }`}
              >
                <AiFillLike
                  size={20}
                  className={userHasLiked ? "text-blue-500" : "text-gray-600"}
                />
                <span
                  className={userHasLiked ? "text-blue-500" : "text-gray-600"}
                >
                  {userHasLiked ? "Liked" : "Like"}
                </span>
              </button>
            </div>

            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handelClick();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded transition font-semibold group"
            >
              <FaComment
                size={18}
                className="group-hover:text-blue-500 transition"
              />
              <span className="group-hover:text-blue-500 transition">
                Comment
              </span>
            </button>

        
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded transition font-semibold group"
            >
              <FaShare
                size={18}
                className="group-hover:text-blue-500 transition"
              />
              <span className="group-hover:text-blue-500 transition">
                Share
              </span>
            </button>
          </div>
        )}
      </div>

      <InteractionModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        title="Likes"
        users={likesData.likes}
        isLoading={isLoadingLikes}
      />

      <InteractionModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        title="Commented By"
        users={commentsList}
        isLoading={isLoadingComments}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={(shareBody) => shareMutate(shareBody)}
        isPending={isSharing}
      />
    </>
  );
}
