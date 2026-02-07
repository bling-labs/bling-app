"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function InfluencerRegisteredRedirect() {
  const router = useRouter()

  useEffect(() => {
    alert("이미 인플루언서로 등록된 상태입니다")
    router.replace("/")
  }, [router])

  return null
}
