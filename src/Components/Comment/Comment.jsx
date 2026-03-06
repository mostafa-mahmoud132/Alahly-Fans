import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getHeaders } from "../../helper/HeadersObj";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Comment({ comment, activePostId }) {
  const { content, createdAt, _id } = comment;
  const { name, photo, _id: commentUserId } = comment.commentCreator;
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: { content: content },
  });

  useEffect(() => {
    setValue("content", content);
  }, [content]);

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: async (values) => {
      const newContent = { content: values.content };
      await axios.put(
        `https://route-posts.routemisr.com/posts/${activePostId}/comments/${_id}`,
        newContent,
        getHeaders(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postComments", activePostId],
      });
      toast.success("Comment updated successfully");
      setIsEditing(false);
    },
    onError: () => toast.error("Error updating comment"),
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `https://route-posts.routemisr.com/posts/${activePostId}/comments/${_id}`,
        getHeaders(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postComments", activePostId],
      });
      toast.success("Comment deleted successfully");
    },
    onError: () => toast.error("Error deleting comment"),
  });

  return (
    <div className="flex gap-3 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
      <img
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition"
        src={photo || "https://via.placeholder.com/40"}
        alt={name}
        onClick={() => navigate(commentUserId === userData?._id ? '/profail' : `/user/${commentUserId}`)}
      />

      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg p-3 mb-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p 
                className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-[#1f6fe5] transition"
                onClick={() => navigate(commentUserId === userData?._id ? '/profail' : `/user/${commentUserId}`)}
              >
                {name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
            {userData?._id === commentUserId && !isEditing && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-gray-100 rounded transition text-blue-500"
                  title="Edit"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={deleteMutate}
                  disabled={isDeleting}
                  className="p-1.5 hover:bg-gray-100 rounded transition text-red-500"
                  title="Delete"
                >
                  {isDeleting ? "..." : <FaTrash size={14} />}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form
              onSubmit={handleSubmit(updateMutate)}
              className="mt-3 flex flex-col gap-2"
            >
              <textarea
                {...register("content")}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-semibold transition disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-sm font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-900 text-sm mt-1 break-words">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
