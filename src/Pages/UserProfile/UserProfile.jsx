import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import usePosts from "../../customHooks/usePosts";
import PostCard from "../../Components/postCard/postCard";
import PostCardLoadingSkeleton from "../../Components/postCard/PostCardSkeleton/PostCardSkeleton";
import CommentsWrapper from "../../Components/CommentsWrapper/CommentsWrapper";
import { FaShare, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import FollowButton from "../../Components/FollowButton/FollowButton";
import { getHeaders } from "../../helper/HeadersObj";

export default function UserProfile() {
  const { id } = useParams();
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activePostId, setActivePostId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const { data: profileQueryResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/${id}/profile`,
        getHeaders()
      );
      const user = data.data?.user || data.user;
      const isFollowing = data.data?.isFollowing ?? false;
      return { user, isFollowing };
    },
    enabled: !!id,
  });

  const profileData = profileQueryResponse?.user;
  const isTargetUserFollowing = profileQueryResponse?.isFollowing;

  const { data: postsData, isLoading: isLoadingPosts, isFetched } = usePosts(
    ["userProfilePosts", id],
    Boolean(id),
    `users/${id}/posts?limit=50`
  );

  return (
    <>
      <title>{profileData?.name ? `${profileData.name}'s Profile` : "User Profile"}</title>

      <div className="bg-gray-50 min-h-screen">
        {/* Back Button */}
        <div className="fixed top-20 left-5 z-40">
          <button
            onClick={() => navigate(-1)}
            className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition flex items-center gap-2 pr-4"
          >
            <FaArrowLeft size={18} className="text-gray-700" />
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">Back</span>
          </button>
        </div>

        {/* Cover Photo */}
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          {profileData?.coverPhoto || profileData?.cover ? (
            <img
              src={profileData?.coverPhoto || profileData?.cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#00298d] via-[#1f6fe5] to-[#c1121f] opacity-80" />
          )}
        </div>

        {/* Profile Container */}
        <div className="max-w-5xl mx-auto px-4 -mt-32 md:-mt-40 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[350px]">
            {isLoadingProfile ? (
              <div className="p-12 text-center flex flex-col items-center animate-pulse">
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gray-200 mb-6 border-4 border-white shadow-lg" />
                <div className="h-10 w-64 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 w-40 bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 w-48 bg-gray-200 rounded-lg mb-8" />
                <div className="flex gap-8 mb-8">
                  <div className="h-12 w-20 bg-gray-200 rounded-xl" />
                  <div className="h-12 w-20 bg-gray-200 rounded-xl" />
                  <div className="h-12 w-20 bg-gray-200 rounded-xl" />
                </div>
                <div className="flex gap-3">
                  <div className="h-12 w-32 bg-gray-200 rounded-xl" />
                  <div className="h-12 w-24 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ) : profileData ? (
              <>
                {/* Profile Picture */}
                <div className="flex justify-center pt-8">
                  <img
                    src={profileData.photo || "https://via.placeholder.com/150"}
                    alt={profileData.name}
                    className="w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg object-cover bg-slate-100"
                  />
                </div>

                {/* User Info */}
                <div className="px-6 pb-8 pt-5 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {profileData.name}
                  </h1>
                  {profileData.username && (
                    <p className="text-gray-500 font-medium mt-1 text-base">
                      @{profileData.username}
                    </p>
                  )}
                  <p className="text-slate-400 mt-1 text-sm">
                    {profileData.email}
                  </p>

                  {/* Stats Bar */}
                  <div className="flex justify-center gap-6 md:gap-10 mt-6 py-4 bg-slate-50 rounded-xl max-w-sm mx-auto border border-slate-100">
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#00298d]">
                        {profileData.followersCount ?? 0}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        Followers
                      </p>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#00298d]">
                        {profileData.followingCount ?? 0}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        Following
                      </p>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#00298d]">
                        {postsData?.posts?.length ?? 0}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        Posts
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 justify-center">
                    {id === userData?._id ? (
                      <button
                        onClick={() => navigate("/profail")}
                        className="bg-[#1f6fe5] hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                      >
                        View My Profile
                      </button>
                    ) : (
                      <FollowButton
                        userId={id}
                        isInitialFollowing={isTargetUserFollowing ?? userData?.following?.some((f) => (f._id || f) === id)}
                        className="px-10 py-2.5 text-base"
                      />
                    )}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Profile link copied!");
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all border border-slate-200 shadow-sm flex items-center gap-2"
                    >
                      <FaShare size={14} /> Share
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">User not found.</p>
              </div>
            )}
          </div>

          {/* Posts Section */}
          <div className="mt-6 mb-16">
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#00298d] rounded-full" />
              {profileData?.name ? `${profileData.name}'s Posts` : "Posts"}
            </h2>

            {isLoadingPosts && <PostCardLoadingSkeleton />}

            <div className="flex flex-col gap-4">
              {isFetched &&
                postsData?.posts?.map((post) => (
                  <div key={post._id}>
                    <PostCard
                      post={post}
                      setIsOpen={setIsOpen}
                      setActivePostId={setActivePostId}
                      activePostId={activePostId}
                    />
                  </div>
                ))}
            </div>

            {isFetched && postsData?.posts?.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <p className="text-gray-400 text-lg">No posts yet.</p>
              </div>
            )}
          </div>
        </div>

        <CommentsWrapper
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleClose={handleClose}
          activePostId={activePostId}
        />
      </div>
    </>
  );
}
