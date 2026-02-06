"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type SignupStep = 1 | 2 | 3

interface StepInfo {
  title: string
  description?: string
}

interface SignupProgressProps {
  currentStep: SignupStep
  userType?: "influencer" | "advertiser" | null
}

const getSteps = (userType?: "influencer" | "advertiser" | null): StepInfo[] => [
  {
    title: "이메일 인증",
    description: "이메일 주소를 인증합니다",
  },
  {
    title: "정보 등록",
    description: userType === "influencer"
      ? "인플루언서 정보를 등록합니다"
      : userType === "advertiser"
        ? "광고주 정보를 등록합니다"
        : "인플루언서 또는 광고주 정보를 등록합니다",
  },
  {
    title: "완료",
    description: "가입이 완료됩니다",
  },
]

export function SignupProgress({ currentStep, userType }: SignupProgressProps) {
  const steps = getSteps(userType)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const stepNumber = (index + 1) as SignupStep
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* 스텝 원형 */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary text-primary bg-background"
                        : "border-muted-foreground/30 text-muted-foreground bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* 스텝 제목 */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {/* 서브 텍스트 */}
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1 max-w-[140px] mx-auto">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 연결선 */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 -translate-y-1/2",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
