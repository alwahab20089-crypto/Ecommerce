import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api/uploadApi";

export const useUploadImageMutation = () => useMutation({ mutationFn: uploadImage });