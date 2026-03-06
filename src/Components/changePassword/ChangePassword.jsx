
import { Button, Label, TextInput } from "flowbite-react";
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import AppAlert from "../../Components/AppAlert/AppAlert";
import { useNavigate } from "react-router-dom";
import { getHeaders } from "../../helper/HeadersObj";
import { AuthContext } from "../../Context/AuthContext";

const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(20, "New password must be at most 20 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangePassword() {
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function handleChangePassword(values) {
    setLoading(true);
    try {
      const { data } = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: values.currentPassword,
          newPassword: values.newPassword,
        },
        getHeaders(),
      );

      if (data.success) {
        setMsg(data.message || "Password updated successfully");
        setIsSuccess(true);
        reset();

        if (data.data?.token) {
          const newToken = data.data.token;
          localStorage.setItem("token", newToken);
          setToken(newToken);
        }
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Error changing password");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <title>Change Password</title>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fadeIn">
      
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 pt-8 pb-6 text-center animate-slideDown">
              <h1 className="text-4xl font-bold text-white mb-2">Change Password</h1>
              <p className="text-blue-100 text-sm">Update your account password</p>
            </div>

            
            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="px-8 py-8"
            >
          
              <div
                className="mb-6 animate-slideIn"
                style={{ animationDelay: "0.1s" }}
              >
                <Label
                  htmlFor="currentPassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Current Password
                </Label>
                <TextInput
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("currentPassword")}
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.currentPassword && (
                  <AppAlert
                    color="failure"
                    content={errors.currentPassword.message}
                  />
                )}
              </div>

            
              <div
                className="mb-6 animate-slideIn"
                style={{ animationDelay: "0.2s" }}
              >
                <Label
                  htmlFor="newPassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  New Password
                </Label>
                <TextInput
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.newPassword && (
                  <AppAlert
                    color="failure"
                    content={errors.newPassword.message}
                  />
                )}
              </div>

            
              <div
                className="mb-6 animate-slideIn"
                style={{ animationDelay: "0.3s" }}
              >
                <Label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Confirm New Password
                </Label>
                <TextInput
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.confirmPassword && (
                  <AppAlert
                    color="failure"
                    content={errors.confirmPassword.message}
                  />
                )}
              </div>

          
              <Button
                type="submit"
                disabled={loading}
                className="w-full mb-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-slideInField"
                style={{ animationDelay: "0.4s" }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </Button>

            
              {msg && (
                <AppAlert
                  color={isSuccess ? "success" : "failure"}
                  content={msg}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}