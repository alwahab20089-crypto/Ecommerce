import { useMutation } from "@tanstack/react-query";
import { submitContactForm } from "../api/contactApi";

export const useContactFormMutation = () => useMutation({ mutationFn: submitContactForm });