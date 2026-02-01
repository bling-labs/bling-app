"use client"

import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <span className="text-xs font-medium text-secondary">PREMIUM INFLUENCER MARKETING</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6">
              <span className="text-foreground">인플루언서 콘텐츠 라이센싱부터</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                광고 제작, 마케팅까지
              </span>
              <br />
              <span className="text-foreground">한 곳에서</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 text-pretty">
              숏폼 영상, 이미지 라이센싱부터 캠페인 진행까지 –<br className="hidden sm:block" />
              복잡한 마케팅 과정을 직관적인 플랫폼 하나로 간단하게 해결하세요.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground px-8 group"
              >
                광고주로 시작하기
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-transparent hover:bg-muted text-foreground px-8 group"
              >
                크리에이터로 등록하기
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Content - Video Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Video Card 1 */}
              <div className="space-y-4">
                <VideoCard
                  image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop"
                  category="Beauty"
                  className="h-48"
                />
                <VideoCard
                  image="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop"
                  category="Food"
                  className="h-36"
                />
              </div>
              {/* Video Card 2 */}
              <div className="space-y-4 pt-8">
                <VideoCard
                  image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop"
                  category="Fitness"
                  className="h-36"
                />
                <VideoCard
                  image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=500&fit=crop"
                  category="Travel"
                  className="h-48"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VideoCard({
  image,
  category,
  className,
}: {
  image: string
  category: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden group cursor-pointer",
        className
      )}
    >
      <Image
        src={image || "/placeholder.svg"}
        alt={category}
        fill
        sizes="(max-width: 768px) 50vw, 200px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Category Badge */}
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 text-xs font-medium text-white bg-primary/80 rounded-full">
          {category}
        </span>
      </div>

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
          <Play className="w-5 h-5 text-background fill-current ml-0.5" />
        </div>
      </div>
    </div>
  )
}
