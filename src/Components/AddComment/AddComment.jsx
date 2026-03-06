import axios from "axios";
import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { getHeaders } from "../../helper/HeadersObj";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { FaPaperPlane } from "react-icons/fa";

export default function AddComment({ activePostId, commentToBeUpdate }) {
  const { userData } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      content: "",
    },
  });

  async function handleAddComment(values) {
    try {
      const objSend = {
        content: values.content,
      };
      const { data } = await axios.post(
        `https://route-posts.routemisr.com/posts/${activePostId}/comments`,
        objSend,
        getHeaders(),
      );
      return data;
    } catch (err) {
      toast.error("Error adding comment");
      throw err;
    }
  }
  const query = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: handleAddComment,
    onSuccess: () => {
      query.invalidateQueries(["postComments", activePostId]);
      toast.success("comment Added successfully");
      reset();
    },
    onError: () => {
      toast.error("Error Adding comment.");
    },
  });

  useEffect(() => {
    if (commentToBeUpdate) {
      setValue("content", commentToBeUpdate.content);
    }
  }, [commentToBeUpdate]);

  async function updateComment() {
    const values = getValues();
    const newContent = { content: values.content };
    const { data } = await axios.put(
      `https://route-posts.routemisr.com/posts/${activePostId}/comments/${commentToBeUpdate._id}`,
      newContent,
      getHeaders(),
    );
    query.invalidateQueries(["postComments", activePostId]);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(mutate)}
      className="px-4 py-3 border-t  border-gray-200 bg-white"
    >
      <div className="flex items-end gap-3">
        <img
          src={userData?.photo || "https://via.placeholder.com/40"}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 flex gap-2 items-end">
          <textarea
            {...register("content")}
            placeholder={
              commentToBeUpdate ? "Edit your comment..." : "Write a comment..."
            }
            className="flex-1 p-3 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none max-h-32"
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 130) + "px";
            }}
          />
          <button
            type="submit"
            disabled={isPending}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition disabled:opacity-50"
            title="Send"
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
      </div>
      {commentToBeUpdate && (
        <div className="flex gap-2 mt-2 ml-12">
          <button
            type="button"
            onClick={updateComment}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition"
          >
            Save Edit
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setValue("content", "");
            }}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold text-sm transition"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
