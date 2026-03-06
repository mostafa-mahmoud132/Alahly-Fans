import { Button, Label, Radio, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { RegistrationSchema } from "../../Schema/AuthSchema";
import AppAlert from "../../Components/AppAlert/AppAlert";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [msg, setmsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
  });

  async function senddata(values) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
      );

      if (data.success === true) {
        setmsg(data.message);
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setmsg(err.response?.data?.message || "Registration failed");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <title>Register</title>
      <div className="min-h-screen mt-20 bg-linear-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-8 pt-8 pb-6 text-center animate-slideDown">
              <h1 className="text-4xl font-bold text-white mb-2">
                Create Account
              </h1>
              <p className="text-blue-100 text-sm">Join Alhly Fans</p>
            </div>
            <form onSubmit={handleSubmit(senddata)} className="px-8 py-8">
              <div
                className="mb-6 animate-slideInField"
                style={{ animationDelay: "0.1s" }}
              >
                <Label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Full Name
                </Label>
                <TextInput
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.name && (
                  <AppAlert color="failure" content={errors.name.message} />
                )}
              </div>
              <div
                className="mb-6 animate-slideInField"
                style={{ animationDelay: "0.2s" }}
              >
                <Label
                  htmlFor="username"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Username
                </Label>
                <TextInput
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.username && (
                  <AppAlert color="failure" content={errors.username.message} />
                )}
              </div>
              <div
                className="mb-6 animate-slideInField"
                style={{ animationDelay: "0.3s" }}
              >
                <Label
                  htmlFor="password1"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password
                </Label>
                <TextInput
                  id="password1"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.password && (
                  <AppAlert color="failure" content={errors.password.message} />
                )}
              </div>
              <div
                className="mb-6 animate-slideInField"
                style={{ animationDelay: "0.4s" }}
              >
                <Label
                  htmlFor="rePassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Confirm Password
                </Label>
                <TextInput
                  {...register("rePassword")}
                  id="rePassword"
                  type="password"
                  placeholder="••••••••"
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.rePassword && (
                  <AppAlert
                    color="failure"
                    content={errors.rePassword.message}
                  />
                )}
              </div>
              <div
                className="mb-6 animate-slideInField"
                style={{ animationDelay: "0.5s" }}
              >
                <Label
                  htmlFor="dateOfBirth"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Date of Birth
                </Label>
                <TextInput
                  {...register("dateOfBirth")}
                  id="dateOfBirth"
                  type="date"
                  placeholder="dd/mm/yyyy"
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.dateOfBirth && (
                  <AppAlert
                    color="failure"
                    content={errors.dateOfBirth.message}
                  />
                )}
              </div>
              <div
                className="mb-6 animate-slideInField"
                style={{ animationDelay: "0.6s" }}
              >
                <Label
                  htmlFor="email1"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email Address
                </Label>
                <TextInput
                  {...register("email")}
                  id="email1"
                  type="email"
                  placeholder="your@email.com"
                  className="transition-all duration-300 focus:scale-105"
                />
                {errors.email && (
                  <AppAlert color="failure" content={errors.email.message} />
                )}
              </div>
              <div
                className="mb-6 animate-slideInField"
                style={{ animationDelay: "0.7s" }}
              >
                <p className="text-gray-700 font-semibold mb-2">Gender</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register("gender")}
                      value="male"
                      className="form-radio text-blue-600"
                    />
                    <span className="text-gray-600">Male</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register("gender")}
                      value="female"
                      className="form-radio text-pink-500"
                    />
                    <span className="text-gray-600">Female</span>
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full mb-4 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-slideInField"
                style={{ animationDelay: "0.8s" }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Sign Up"
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
