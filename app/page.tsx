"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SoftOrbs from "@/components/interview/soft-orbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/lib/store/formStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSkills, startInterviewAPI } from "@/lib/api";
import { useInterviewStore } from "@/lib/store/interviewStore";
import { getDomains, getRolesByDomainId } from "@/lib/jobsApi";
import { DomainProps } from "@/types";

const DOMAINS = [
  "Software",
  "Marketing",
  "Finance",
  "Design",
  "Product Management",
  "Data Science",
];

export default function StartInterviewPage() {
  const router = useRouter();
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const [domains, setDomains] = useState<DomainProps[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [recommendedSkillsLoading, setRecommendedSkillsLoading] =
    useState(false);

  const { formData, setFormData, startInterview, resetForm } = useFormStore();
  const {
    incrementQuestionCount,
    addQuestion,
    resetConversation,
    resetQuestionCount,
  } = useInterviewStore();

  useEffect(() => {
    const getAllDomains = async () => {
      const response = await getDomains();

      if (!response.success) {
        console.error(
          "failed to fetch the domains, you can try again by refreshing"
        );
      }

      setDomains(response.domains);
      return;
    };

    getAllDomains();
  }, []);

  useEffect(() => {
    const getJobRoleByDomain = async () => {
      if (formData.domain && selectedDomainId) {
        const response = await getRolesByDomainId(selectedDomainId);

        if (!response.success) {
          console.error("failed to load job roles, try again by refreshing");
        }

        setJobRoles(response?.jobRoles);
        return;
      }
    };

    getJobRoleByDomain();
  }, [formData.domain, selectedDomainId]);

  const fetchSkills = async () => {
    setRecommendedSkillsLoading(true);
    try {
      const res = await getSkills({
        domain: formData.domain,
        jobRole: formData.jobRole,
      });

      if (res.success) {
        setRecommendedSkills(res.skills);
      }
      setRecommendedSkillsLoading(false);
    } catch (error) {
      console.log("error fetching skills: ", error);
      setRecommendedSkillsLoading(false);
    }
  };

  useEffect(() => {
    if (!formData.domain || !formData.jobRole) return;

    fetchSkills();
  }, [formData.domain, formData.jobRole]);

  const handleAddSkill = (newSkill: string) => {
    const trimmed = newSkill.trim();

    const isValid =
      trimmed.length >= 2 &&
      !formData.skills.includes(trimmed) &&
      formData.skills.length < 5;

    if (isValid) {
      setFormData({ skills: [...formData.skills, trimmed] });
      setSkills("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(skills);
    }
  };

  const removeSkill = (removedSkill: string) => {
    setFormData({ skills: formData.skills.filter((s) => s !== removedSkill) });
  };

  const toggleSkills = (skill: string) => {
    if (!skill) return;

    const isExist = formData.skills.find((s) => s === skill);

    if (isExist) {
      setRecommendedSkills(recommendedSkills.filter((s) => s !== skill));
    } else {
      handleAddSkill(skill);
      setRecommendedSkills(recommendedSkills.filter((s) => s !== skill));
    }
  };

  const handleStart = () => {
    setLoading(true);
    if (!formData.jobRole || !formData.domain || formData.skills.length < 2) {
      return;
    }
    startInterview();
    resetConversation();
    resetQuestionCount();
    handleStartInterview({
      jobRole: formData.jobRole,
      domain: formData.domain,
      skills: formData.skills,
    });
    router.push("/interview");
  };

  const handleStartInterview = async (setupData: {
    jobRole: string;
    domain: string;
    skills: string[];
  }) => {
    const { jobRole, domain, skills } = setupData;

    if (!jobRole || !domain) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    if (skills.length <= 2) {
      alert("minimun 3 Skills are required.");
      setLoading(false);
      return;
    }

    try {
      const data = await startInterviewAPI(setupData);

      if (!data.success || !data.sessionId || !data.question) {
        throw new Error("Failed to start interview. Please try again.");
      }

      localStorage.setItem("sessionId", data.sessionId);

      addQuestion(data.question);
      incrementQuestionCount();

      router.replace(`/interview`);
      // speakTextWithTTS(data.question);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  return (
    <main className="relative grid h-[90vh] place-items-center bg-background text-foreground">
      <SoftOrbs />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-border bg-background/70 p-8 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Start Your Interview
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStart();
            }}
            className="space-y-5"
          >
            <div>
              <Label
                htmlFor="domain"
                className="mb-2 block text-sm font-medium"
              >
                Domain
              </Label>
              <select
                id="domain"
                value={formData.domain}
                onChange={(e) => {
                  const selected = domains.find(
                    (d) => d.domain === e.target.value
                  );
                  setSelectedDomainId(selected ? selected.id : null);
                  setFormData({ domain: e.target.value });
                }}
                required
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50 text-foreground",
                  !formData.domain && "text-muted-foreground"
                )}
              >
                <option value="" disabled>
                  Select a domain
                </option>
                {domains?.map((domain) => (
                  <option value={domain.domain} key={domain.id}>
                    {domain.domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label
                htmlFor="jobRole"
                className="mb-2 block text-sm font-medium"
              >
                Job Role
              </Label>

              <select
                id="jobRole"
                value={formData.jobRole}
                onChange={(e) => setFormData({ jobRole: e.target.value })}
                required
                disabled={!formData.domain}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50 text-foreground",
                  !formData.jobRole && "text-muted-foreground"
                )}
              >
                <option value="" disabled>
                  Select a Job Role
                </option>
                {jobRoles?.map((role, i) => (
                  <option value={role} key={`role_${i}`}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full relative">
              <Label
                htmlFor="skills"
                className="mb-2 block text-sm font-medium"
              >
                Skills{" "}
                <span className="text-xs opacity-70">(comma-separated)</span>
              </Label>
              <Input
                placeholder="Type a skill and press Enter"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                minLength={2}
                onKeyDown={handleKeyDown}
                className="px-3 py-2 text-sm sm:text-base "
                disabled={formData.skills.length >= 5}
              />
              {skills.trim() && (
                <ul className="absolute z-10 w-full bg-background border rounded mt-1 shadow-md">
                  <li
                    className="px-3 py-2 text-sm  cursor-pointer"
                    onClick={() => handleAddSkill(skills)}
                  >
                    Add “{skills}”
                  </li>
                </ul>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData?.skills?.map((skill) => (
                  <Badge
                    key={`skill-${skill}`}
                    variant="outline"
                    className="flex items-center gap-2 text-base"
                  >
                    {skill}
                    <p
                      className="cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      x
                    </p>
                  </Badge>
                ))}
              </div>

              {recommendedSkillsLoading ? (
                <div className="py-4 w-full">
                  <p className="cursor-pointer text-sm mb-1 sm:mb-0 sm:text-base font-medium ">
                    Recommended Skills
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Skeleton className="h-6 sm:h-7 w-1/2" />
                    <Skeleton className="h-6 sm:h-7 w-1/3" />
                    <Skeleton className="h-6 sm:h-7 w-1/5" />
                    <Skeleton className="h-6 sm:h-7 w-1/2" />
                    <Skeleton className="h-6 sm:h-7 w-1/4" />
                  </div>
                </div>
              ) : (
                recommendedSkills?.length > 0 && (
                  <div className="py-4">
                    <p className="cursor-pointer text-sm mb-1 sm:mb-0 sm:text-base font-medium ">
                      Recommended Skills by AI
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recommendedSkills?.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-base flex items-center gap-2 cursor-pointer"
                          onClick={() => toggleSkills(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={
                  loading ||
                  !formData.jobRole.trim() ||
                  !formData.domain.trim() ||
                  !(formData.skills.length > 2)
                }
                className="cursor-pointer w-full border-0 bg-[var(--color-primary)] text-background hover:bg-[var(--color-primary)]/90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-75"
                      />
                    </svg>
                    Starting...
                  </span>
                ) : (
                  "Start Interview"
                )}
              </Button>

              <p
                onClick={resetForm}
                className="flex items-center justify-center text-xs text-destructive cursor-pointer"
              >
                Clear Form
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
