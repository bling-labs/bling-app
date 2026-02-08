import { NextResponse } from "next/server"
import { mongoClient } from "@bling/mongodb"

export async function GET() {
  try {
    const result = await mongoClient.db("admin").command({ ping: 1 })
    console.log("[MongoDB] 연결 성공:", result)

    const db = mongoClient.db("bling")
    const collections = await db.listCollections().toArray()
    console.log("[MongoDB] bling DB 컬렉션 목록:", collections.map((c) => c.name))

    return NextResponse.json({
      status: "connected",
      ping: result,
      database: "bling",
      collections: collections.map((c) => c.name),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류"
    console.error("[MongoDB] 연결 실패:", message)
    return NextResponse.json({ status: "error", message }, { status: 500 })
  }
}
