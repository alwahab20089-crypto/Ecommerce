import { useMutation } from "@tanstack/react-query";
import { subscribeNewsletter } from "../api/newsletterApi";

export const useSubscribeNewsletterMutation = () => useMutation({ mutationFn: subscribeNewsletter });