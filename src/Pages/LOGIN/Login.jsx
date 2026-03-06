import { Button, Label, TextInput } from "flowbite-react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoginSchema } from "../../Schema/AuthSchema";
import AppAlert from "../../Components/AppAlert/AppAlert";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function Login() {
  const [msg, setmsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function sendlogindata(values) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
      );

      if (data.success === true) {
        setmsg(data.message);
        setIsSuccess(true);

        const newToken = data.data.token;

        localStorage.setItem("token", newToken);
        setToken(newToken);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      setmsg(err.response?.data?.message || "Login failed");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <title>Login</title>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 pt-8 pb-6 text-center animate-slideDown">
              <h1 className="text-4xl font-bold text-white mb-2">Alhly Fans</h1>
              <p className="text-blue-100 text-sm">Welcome back</p>
            </div>

            <form onSubmit={handleSubmit(sendlogindata)} className="px-8 py-8">
              <div
                className="mb-6 animate-slideIn"
                style={{ animationDelay: "0.1s" }}
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
                className="mb-6 animate-slideIn"
                style={{ animationDelay: "0.2s" }}
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full mb-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-slideInField"
                style={{ animationDelay: "0.3s" }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {msg && (
                <AppAlert
                  color={isSuccess ? "success" : "failure"}
                  content={msg}
                />
              )}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <p
                className="text-center text-gray-600 animate-slideInField"
                style={{ animationDelay: "0.4s" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-indigo-600 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
