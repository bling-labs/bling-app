"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteInfluencerDraft } from "./actions"

export function DraftInfluencerWarning({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  if (confirmed) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md rounded-lg border p-6 text-center">
        <p className="mb-6 text-sm text-muted-foreground">
          인플루언서로 입력중인 정보가 있습니다.
          <br />
          광고주 등록 진행을 시작하면 기존에 입력된 인플루언서 데이터는
          삭제됩니다.
          <br />
          진행하시겠습니까?
        </p>
        <div className="flex justify-center gap-3">
          <button
            className="rounded-md border px-4 py-2 text-sm"
            onClick={() => router.replace("/")}
            disabled={loading}
          >
            취소
          </button>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              const result = await deleteInfluencerDraft()
              if (result?.error) {
                alert(result.error)
                setLoading(false)
                return
              }
              setConfirmed(true)
            }}
          >
            {loading ? "처리중..." : "진행하기"}
          </button>
        </div>
      </div>
    </div>
  )
}
