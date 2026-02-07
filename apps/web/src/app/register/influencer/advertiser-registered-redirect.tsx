"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AdvertiserRegisteredRedirect() {
  const router = useRouter()

  useEffect(() => {
    alert("광고주로 가입된 회원입니다.")
    router.replace("/")
  }, [router])

  return null
}
