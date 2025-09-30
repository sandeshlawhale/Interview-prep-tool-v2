import { FormState, InterviewSetupData } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultFormData: InterviewSetupData = {
  jobRole: "",
  domain: "",
  skills: [],
};

export const useFormStore = create<
  FormState & {
    interviewStarted: boolean;
    interviewEnded: boolean;
    startInterview: () => void;
    endInterview: () => void;
  }
>()(
  persist(
    (set) => ({
      formData: defaultFormData,
      interviewStarted: false,
      interviewEnded: false,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      saveFormData: (data: InterviewSetupData) =>
        set(() => ({
          formData: { ...data },
        })),

      resetForm: () =>
        set(() => ({
          formData: defaultFormData,
          interviewStarted: false,
          interviewEnded: false,
        })),

      startInterview: () =>
        set({ interviewStarted: true, interviewEnded: false }),
      endInterview: () =>
        set({ interviewStarted: false, interviewEnded: true }),
    }),
    {
      name: "form-storage",
    }
  )
);
