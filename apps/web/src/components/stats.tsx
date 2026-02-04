"use client"

import { useEffect, useState, useRef } from "react"
import { Users, Film, FileCheck, Coins } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: 3500,
    suffix: "+",
    label: "활동 중인 인플루언서",
    description: "검증된 크리에이터",
  },
  {
    icon: Film,
    value: 15000,
    suffix: "+",
    label: "판매 가능한 콘텐츠",
    description: "숏폼 + 이미지",
  },
  {
    icon: FileCheck,
    value: 8200,
    suffix: "+",
    label: "완료된 거래",
    description: "라이센스 계약",
  },
  {
    icon: Coins,
    value: 2.4,
    suffix: "B+",
    prefix: "₩",
    label: "총 거래액",
    description: "누적 금액",
  },
]

function useCountUp(end: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(end * easeOut)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isVisible])

  return count
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({
  stat,
  isVisible,
}: {
  stat: (typeof stats)[0]
  isVisible: boolean
}) {
  const count = useCountUp(stat.value, 2000, isVisible)
  const Icon = stat.icon

  const formatValue = (value: number) => {
    if (stat.value < 10) {
      return value.toFixed(1)
    }
    return Math.floor(value).toLocaleString()
  }

  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
        {stat.prefix}
        {formatValue(count)}
        {stat.suffix}
      </div>
      <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
      <div className="text-xs text-muted-foreground">{stat.description}</div>
    </div>
  )
}
