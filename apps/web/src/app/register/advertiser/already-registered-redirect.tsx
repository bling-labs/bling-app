"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AlreadyRegisteredRedirect() {
  const router = useRouter()

  useEffect(() => {
    alert("이미 가입된 상태입니다")
    router.replace("/")
  }, [router])

  return null
}
