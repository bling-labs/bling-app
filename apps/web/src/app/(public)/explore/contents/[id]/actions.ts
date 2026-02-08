"use server"

import { getDb } from "@bling/mongodb"

export interface AdRequestInput {
  contentId: string
  creatorId: string
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  productName: string
  requirements: string
  budget?: string
  deadline?: string
  additionalNotes?: string
}

export async function submitAdRequest(input: AdRequestInput) {
  try {
    const db = await getDb()
    const result = await db.collection("ad_requests").insertOne({
      ...input,
      status: "pending",
      createdAt: new Date(),
    })

    console.log("[AdRequest] 저장 완료:", result.insertedId)
    return { error: null, id: result.insertedId.toString() }
  } catch (e) {
    const message = e instanceof Error ? e.message : "의뢰 접수에 실패했습니다"
    console.error("[AdRequest] 저장 실패:", message)
    return { error: message, id: null }
  }
}
