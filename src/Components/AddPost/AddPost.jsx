import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
import { getHeaders } from "../../helper/HeadersObj";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";

export default function AddPost({ postToBeUpdate }) {
  const { userData } = useContext(AuthContext);
  const { register, handleSubmit, setValue, reset, getValues } = useForm({
    defaultValues: {
      body: "",
      image: null,
    },
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postToBeUpdate ? updatePostFn : createPostFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["profailPosts"] });
      toast.success(
        postToBeUpdate
          ? "Post updated successfully"
          : "Post added successfully",
      );
      reset();
    },
    onError: () => {
      toast.error("Error adding post.");
    },
  });

  useEffect(() => {
    if (postToBeUpdate) {
      setValue("body", postToBeUpdate.body);
    }
  }, [postToBeUpdate]);

  async function createPostFn(values) {
    const formData = new FormData();
    formData.append("body", values.body);
    if (values.image) {
      formData.append("image", values.image[0]);
    }
    const response = await axios.post(
      "https://route-posts.routemisr.com/posts",
      formData,
      getHeaders(),
    );
    return response;
  }

  async function updatePostFn(values) {
    const formData = new FormData();
    formData.append("body", values.body);

    if (values.image) {
      formData.append("image", values.image[0]);
    }

    const response = await axios.put(
      `https://route-posts.routemisr.com/posts/${postToBeUpdate._id}`,
      formData,
      getHeaders(),
    );

    return response;
  }
  return (
    <div className="conatiner">
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="bg-white mt-12 w-full m-auto rounded-2xl shadow-md border border-gray-200 p-4 mb-4 m-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={userData?.photo || "https://via.placeholder.com/40"}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <textarea
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          rows={1}
          placeholder={
            postToBeUpdate ? "Edit your post..." : "What's on your mind?"
          }
          {...register("body")}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
        ></textarea>
      </div>

      <div id="imagePreview" className="mb-3"></div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            {...register("image")}
            type="file"
            id="postImage"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const preview = document.getElementById("imagePreview");
                  preview.innerHTML = `
                    <div className="relative">
                      <img src="${event.target.result}" alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                      <button type="button" onclick="document.getElementById('postImage').value=''; document.getElementById('imagePreview').innerHTML=''" className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600">×</button>
                    </div>
                  `;
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label
            htmlFor="postImage"
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
          >
            <FaImage className="text-lg" />
            <span className="text-sm font-medium">Photo/Video</span>
          </label>
        </div>

        <button
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Processing..."
            : postToBeUpdate
              ? "Update Post"
              : "Post"}
        </button>
      </div>
    </form>
    </div>
  );
}
