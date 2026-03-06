import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePosts from "../../customHooks/usePosts";
import PostCard from "../../Components/postCard/postCard";
import PostCardLoadingSkeleton from "../../Components/postCard/PostCardSkeleton/PostCardSkeleton";
import AddPost from "../../Components/AddPost/AddPost";
import CommentsWrapper from "../../Components/CommentsWrapper/CommentsWrapper";
import { FiSettings } from "react-icons/fi";
import { FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, FileInput, Label } from "flowbite-react";
import toast from "react-hot-toast";
import { getHeaders } from "../../helper/HeadersObj";
import { AiFillLike } from "react-icons/ai";

// Own profile page - always shows the logged-in user's profile
export default function Profail() {
  const { userData, setUserData } = useContext(AuthContext);
  const isOwnProfile = true;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Always own profile - fetch profile-data endpoint
  const { data: profileQueryResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userData?._id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/profile-data`,
        getHeaders()
      );
      const user = data.data?.user || data.user;
      return { user };
    },
    enabled: !!userData?._id
  });

  const profileData = profileQueryResponse?.user;

  const { data, isLoading, isFetched } = usePosts(
    ["profailPosts", userData?._id],
    Boolean(userData?._id),
    `users/${userData?._id}/posts?limit=50`,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [postToBeUpdate, setPostToBeUpdate] = useState(null);
  const [activePostId, setActivePostId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const handleClose = () => setIsOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCoverFile(file);
      toast.success(`Cover photo selected: ${file.name}`);
    }
  };

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", file);

      const { data } = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            token: token || "",
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onMutate: () => {
      toast.loading("Uploading photo...", { id: "upload-photo" });
    },
    onSuccess: (data) => {
      if (data.message === "success") {
        setUserData((prev) => ({
          ...prev,
          photo: data.user.photo,
        }));
        queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
        toast.success("Profile photo updated successfully", {
          id: "upload-photo",
        });
        setIsPhotoModalOpen(false);
        setSelectedFile(null);
        setPhotoCaption("");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload photo", {
        id: "upload-photo",
      });
    },
  });

  const uploadCoverPhotoMutation = useMutation({
    mutationFn: async (file) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("coverPhoto", file);

      const { data } = await axios.put(
        "https://route-posts.routemisr.com/users/upload-cover-photo",
        formData,
        {
          headers: {
            token: token || "",
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onMutate: () => {
      toast.loading("Uploading cover photo...", { id: "upload-cover" });
    },
    onSuccess: (data) => {
      if (data.message === "success") {
        setUserData((prev) => ({
          ...prev,
          coverPhoto: data.user.coverPhoto,
        }));
        toast.success("Cover photo updated successfully", {
          id: "upload-cover",
        });
        setIsCoverModalOpen(false);
        setSelectedCoverFile(null);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to upload cover photo",
        {
          id: "upload-cover",
        },
      );
    },
  });

  const handleUploadPhoto = () => {
    if (!selectedFile) {
      toast.error("Please select a photo first");
      return;
    }
    uploadPhotoMutation.mutate(selectedFile);
  };

  const handleUploadCoverPhoto = () => {
    if (!selectedCoverFile) {
      toast.error("Please select a cover photo first");
      return;
    }
    uploadCoverPhotoMutation.mutate(selectedCoverFile);
  };

  return (
    <>
      <title>Profile</title>

      <div className="bg-gray-50 min-h-screen">
        <div className="fixed top-20 right-5 z-40">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
          >
            <FiSettings size={24} className="text-gray-800" />
          </button>
        </div>
{isSettingsOpen && (
  <>
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
      onClick={() => setIsSettingsOpen(false)}
    ></div>

    <div
      className={`
        fixed right-0 z-50 w-72 bg-white shadow-2xl flex flex-col
        lg:h-full lg:top-0 lg:bottom-0
        md:h-[605px] md:top-16 md:bottom-auto
        sm:h-[605px] sm:top-16 sm:bottom-auto
        rounded-l-xl overflow-y-auto transform transition-transform duration-300 ease-in-out
        animate-slideIn
      `}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={userData?.photo || "https://via.placeholder.com/40"}
            alt={userData?.name || "User"}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <div className="flex flex-col">
            <p className="font-semibold text-gray-900 text-sm truncate">{userData?.name}</p>
            <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
          </div>
        </div>
        <button
          className="text-2xl text-gray-600 hover:text-gray-800 transition"
          onClick={() => setIsSettingsOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-2">
        <button
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition text-gray-800 font-medium"
          onClick={() => {
            setIsSettingsOpen(false);
            navigate("/changePassword");
          }}
        >
          <FiSettings size={20} className="text-blue-500" />
          Change Password
        </button>

        <button
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition text-gray-800 font-medium"
          onClick={() => {
            setIsSettingsOpen(false);
            setIsPhotoModalOpen(true);
          }}
        >
          <AiFillLike size={20} className="text-green-500" />
          Change Profile Picture
        </button>

        <button
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition text-gray-800 font-medium"
          onClick={() => {
            setIsSettingsOpen(false);
            setIsCoverModalOpen(true);
          }}
        >
          <FaShare size={20} className="text-purple-500" />
          Change Cover Photo
        </button>
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          className="flex items-center gap-3 w-full p-3 hover:bg-red-100 rounded-lg transition text-red-500 font-semibold"
          onClick={() => {
            localStorage.removeItem("token");
            setUserData(null);
            navigate("/login");
          }}
        >
          <FiSettings size={20} />
          Logout
        </button>
      </div>
    </div>
  </>
)}
        <div className="relative w-full h-96 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden group">
          {profileData?.coverPhoto || (isOwnProfile && userData?.coverPhoto) ? (
            <img
              src={profileData?.coverPhoto || userData?.coverPhoto}
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-r from-[#00298d] via-[#1f6fe5] to-[#c1121f] opacity-80"></div>
          )}

          <button
            onClick={() => setIsCoverModalOpen(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg font-semibold transition opacity-0 group-hover:opacity-100"
          >
            📷 Edit Cover Photo
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-40 relative z-10">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden min-h-[400px]">
            {isLoadingProfile ? (
              <div className="p-12 text-center flex flex-col items-center animate-pulse">
                <div className="w-48 h-48 rounded-full bg-gray-200 mb-6 border-4 border-white shadow-lg"></div>
                <div className="h-10 w-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded-lg mb-8"></div>
                <div className="flex gap-8 mb-8">
                  <div className="h-12 w-20 bg-gray-200 rounded-xl"></div>
                  <div className="h-12 w-20 bg-gray-200 rounded-xl"></div>
                  <div className="h-12 w-20 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-12 w-32 bg-gray-200 rounded-xl"></div>
                  <div className="h-12 w-24 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center pt-8">
                  <div className="relative">
                    <img
                      src={profileData?.photo || userData?.photo || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover bg-slate-100"
                    />
                    <button
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="absolute bottom-3 right-3 bg-[#1f6fe5] hover:bg-blue-600 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
                    >
                      📷
                    </button>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-6 text-center">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {profileData?.name || userData?.name || "User"}
                  </h1>
                  <p className="text-gray-600 font-medium mt-1">
                    @{profileData?.username || userData?.username || ""}
                  </p>
                  <p className="text-slate-500 mt-2">
                    {profileData?.email || userData?.email || ""}
                  </p>
                  
                  <div className="flex justify-center gap-8 mt-6 py-4 border-y border-gray-50 bg-slate-50/50 rounded-xl max-w-lg mx-auto">
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#00298d]">{profileData?.followersCount || 0}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#00298d]">{profileData?.followingCount || 0}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#00298d]">{data?.posts?.length || 0}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Posts</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8 justify-center">
                    <button
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 border border-slate-200"
                    >
                      📷 Update Profile Photo
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Profile link copied!");
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-bold transition-all border border-slate-200 shadow-sm flex items-center justify-center"
                    >
                      <FaShare className="mr-2" /> Share
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#00298d] rounded-full"></span>
                Create Post
              </h2>
              <AddPost postToBeUpdate={postToBeUpdate} />
            </div>

            {isLoading && <PostCardLoadingSkeleton />}

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-900 px-1 flex items-center gap-2">
              </h2>
              {isFetched &&
                data?.posts?.map((post) => (
                  <div key={post._id}>
                    <PostCard
                      post={post}
                      setIsOpen={setIsOpen}
                      setActivePostId={setActivePostId}
                      activePostId={activePostId}
                      setPostToBeUpdate={setPostToBeUpdate}
                    />
                  </div>
                ))}
            </div>

            {isFetched && data?.posts?.length === 0 && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share!
                </p>
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

      {isCoverModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Cover Photo</h3>
              <button
                onClick={() => {
                  setIsCoverModalOpen(false);
                  setSelectedCoverFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="cover-photo-upload"
                  value="Select a new cover photo"
                />
                <FileInput
                  id="cover-photo-upload"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  helperText="Upload a JPG, PNG, or GIF image (max 5MB)"
                />
              </div>

              {selectedCoverFile && (
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(selectedCoverFile)}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={handleUploadCoverPhoto}
                disabled={
                  uploadCoverPhotoMutation.isPending || !selectedCoverFile
                }
                color="blue"
              >
                {uploadCoverPhotoMutation.isPending
                  ? "Uploading..."
                  : "Upload Cover Photo"}
              </Button>
              <Button
                onClick={() => {
                  setIsCoverModalOpen(false);
                  setSelectedCoverFile(null);
                }}
                color="gray"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Profile Picture</h3>
              <button
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setSelectedFile(null);
                  setPhotoCaption("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="photo-upload"
                  value="Select a new profile picture"
                />
                <FileInput
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  helperText="Upload a JPG, PNG, or GIF image (max 5MB)"
                />
              </div>

              <div>
                <Label
                  htmlFor="photo-caption"
                  value="Add a caption (optional)"
                />
                <textarea
                  id="photo-caption"
                  placeholder="Add a caption for your profile picture..."
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  maxLength="200"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  rows="3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {photoCaption.length}/200
                </p>
              </div>

              {selectedFile && (
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={handleUploadPhoto}
                disabled={uploadPhotoMutation.isPending || !selectedFile}
                color="blue"
              >
                {uploadPhotoMutation.isPending
                  ? "Uploading..."
                  : "Upload Photo"}
              </Button>
              <Button
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setSelectedFile(null);
                  setPhotoCaption("");
                }}
                color="gray"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
