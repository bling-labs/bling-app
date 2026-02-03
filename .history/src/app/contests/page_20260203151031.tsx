"use client"

import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import { CONTESTS_DATA, type ContestItem } from "@/data/contests"

function ContestCard({ contest, isPriority }: { contest: ContestItem; isPriority?: boolean }) {
  return (
    <Link
      href={`/contests/${contest.id}`}
      className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all"
    >
      {/* 좌측: 포스터 이미지 (4:3) */}
      <div className="relative w-full sm:w-[280px] shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-muted">
        <Image
          src={contest.posterImageUrl}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 280px"
          priority={isPriority}
        />
      </div>

      {/* 우측: 타이틀, 요약, 핵심 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {contest.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
          {contest.summary}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          접수 {contest.applicationPeriod} · {contest.contentType}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline">
          자세히 보기
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-4xl mb-4">🎬</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">등록된 컨테스트가 없습니다</h3>
      <p className="text-muted-foreground text-center max-w-sm">
        진행 중인 공모전이 없습니다. 곧 새로운 공모전이 올라올 예정입니다.
      </p>
    </div>
  )
}

export default function ContestsPage() {
  const contests = CONTESTS_DATA

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* 페이지 헤더 */}
          <header className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">컨테스트</h1>
            <p className="mt-2 text-muted-foreground">진행 중인 공모전을 확인하세요</p>
          </header>

          {/* 목록 */}
          {contests.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-6" role="list">
              {contests.map((contest, index) => (
                <li key={contest.id}>
                  <ContestCard contest={contest} isPriority={index < 2} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
