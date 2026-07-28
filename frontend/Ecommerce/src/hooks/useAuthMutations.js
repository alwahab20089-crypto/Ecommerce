import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../api/authApi";
import { forgotPassword, resetPassword } from "../api/authApi";
import { googleAuth } from "../api/authApi";

export const useGoogleAuthMutation = () => useMutation({ mutationFn: googleAuth });

export const useForgotPasswordMutation = () => useMutation({ mutationFn: forgotPassword });
export const useResetPasswordMutation = () => useMutation({ mutationFn: resetPassword });

export const useRegisterMutation = () => useMutation({ mutationFn: registerUser });
export const useLoginMutation = () => useMutation({ mutationFn: loginUser });