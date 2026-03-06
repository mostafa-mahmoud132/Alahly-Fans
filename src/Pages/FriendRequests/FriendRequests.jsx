

import React, { useState, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getHeaders } from "../../helper/HeadersObj";
import { AuthContext } from "../../Context/AuthContext";
import FollowButton from "../../Components/FollowButton/FollowButton";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaUserCheck, FaLightbulb } from "react-icons/fa";
import toast from "react-hot-toast";

export default function FriendRequests() {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [offset, setOffset] = useState(0);
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const followingIds = userData?.following?.map((f) => f._id || f) || [];
  const { data: listData, isLoading: isListLoading } = useQuery({
    queryKey: ["userConnections", activeTab, offset],
    queryFn: async () => {
      if (activeTab === "suggestions") return [];
      const connections = userData?.[activeTab] || [];
      const profiles = await Promise.all(
        connections.map(async (u) => {
          const userId = u._id || u;
          try {
            const { data } = await axios.get(
              `https://route-posts.routemisr.com/users/${userId}/profile`,
              getHeaders()
            );
            return { ...(data.data?.user || {}), isFollowing: data.data?.isFollowing };
          } catch {
            return { _id: userId, name: "No Name", photo: "", username: "" };
          }
        })
      );
      return profiles;
    },
    enabled: activeTab !== "suggestions",
  });

  const { data: suggestionsData, isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ["followSuggestions", offset],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/suggestions?limit=10&offset=${offset}`,
        getHeaders()
      );
      return data.data?.suggestions || [];
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading =
    activeTab === "suggestions" ? isSuggestionsLoading : isListLoading;
  const currentList =
    activeTab === "suggestions" ? suggestionsData : listData || [];

  const tabs = [
    {
      id: "suggestions",
      label: "Suggestions",
      icon: FaLightbulb,
      count: null,
    },
    {
      id: "followers",
      label: "Followers",
      icon: FaUserFriends,
      count: userData?.followersCount || 0,
    },
    {
      id: "following",
      label: "Following",
      icon: FaUserCheck,
      count: userData?.followingCount || 0,
    },
  ];

  return (
    <div className="container mx-auto p-5 mt-20 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#00298d]">Connections</h2>
          <p className="text-sm text-slate-500 mt-1">
            Discover people and manage your network
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setOffset(0);
                }}
                className={`flex-1 py-4 text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                  isActive
                    ? "text-[#1f6fe5] border-b-2 border-[#1f6fe5] bg-blue-50/30"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-[#1f6fe5]" : "text-gray-400"}
                />
                <span>
                  {tab.label}
                  {tab.count !== null ? ` (${tab.count})` : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {activeTab === "suggestions" && !isLoading && (
            <div className="mb-4 px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1f6fe5] flex items-center justify-center flex-shrink-0">
                <FaLightbulb size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#00298d]">
                  People You May Know
                </p>
                <p className="text-xs text-slate-500">
                  Follow people to see their posts in your feed
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-2"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={48} height={48} />
                    <div>
                      <Skeleton width={120} height={14} />
                      <Skeleton width={80} height={12} className="mt-1" />
                    </div>
                  </div>
                  <Skeleton width={80} height={36} borderRadius={8} />
                </div>
              ))}
            </div>
          ) : currentList.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-50">
                {currentList.map((user) => (
                  <li
                    key={user._id}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 flex-1 min-w-0"
                      onClick={() =>
                        navigate(
                          user._id === userData?._id
                            ? "/profail"
                            : `/user/${user._id}`
                        )
                      }
                    >
                      <img
                        src={user.photo || "https://via.placeholder.com/48"}
                        alt={user.name || "No Name"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {user.name || "No Name"}
                        </p>
                        {user.username && (
                          <p className="text-xs text-slate-400">
                            @{user.username}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-3">
                      <FollowButton
                        userId={user._id}
                        isInitialFollowing={
                          user.isFollowing ??
                          followingIds.includes(user._id)
                        }
                      />
                    </div>
                  </li>
                ))}
              </ul>

              {(activeTab === "suggestions" ||
                (activeTab === "following" &&
                  currentList.length < (userData?.followingCount || 0))) && (
                <div className="mt-4 text-center">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setOffset((prev) => prev + 10)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                {activeTab === "suggestions" ? (
                  <FaLightbulb size={24} className="text-slate-300" />
                ) : activeTab === "followers" ? (
                  <FaUserFriends size={24} className="text-slate-300" />
                ) : (
                  <FaUserCheck size={24} className="text-slate-300" />
                )}
              </div>
              <p className="text-slate-400 font-semibold text-base">
                {activeTab === "suggestions"
                  ? "No suggestions available right now"
                  : `No ${activeTab} yet`}
              </p>
              <p className="text-slate-300 text-sm mt-1">
                {activeTab === "suggestions"
                  ? "Check back later for new people to follow"
                  : `You have no ${activeTab} at the moment`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}