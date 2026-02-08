"use client"

import { useState, useEffect, useSyncExternalStore, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Bell,
  ChevronDown,
  FileText,
  Megaphone,
  CheckCircle,
  DollarSign,
} from "lucide-react"
import { Button } from "@bling/ui"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import {
  NOTIFICATIONS_MOCK,
  getUnreadCount,
  type NotificationItem,
} from "@/data/notifications"

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

const NAV_LINKS = [
  { href: "/explore/contents", label: "콘텐츠" },
  { href: "/explore/campaigns", label: "캠페인" },
  { href: "/explore/contests", label: "컨테스트" },
  { href: "/explore/influencers", label: "인플루언서" },
] as const

type Me = { userType: "influencer" | "advertiser" | null; displayName: string | null }

const NOTIFICATION_ICONS: Record<NotificationItem["type"], React.ComponentType<{ className?: string }>> = {
  licensing: FileText,
  campaign: Megaphone,
  approval: CheckCircle,
  settlement: DollarSign,
  notice: Bell,
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const mounted = useHasMounted()
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const unreadCount = getUnreadCount()
  const dashboardHref = me?.userType === "advertiser" ? "/advertiser" : "/creator"
  const roleLabel = me?.userType === "influencer" ? "인플루언서 회원" : me?.userType === "advertiser" ? "광고주 회원" : ""

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setMe(null)
      return
    }
    fetch("/api/me")
      .then((res) => res.json())
      .then((data: Me) => setMe(data))
      .catch(() => setMe(null))
  }, [user?.id])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setProfileOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setMe(null)
    router.push("/")
    router.refresh()
  }

  const isActive = (href: string) => pathname.startsWith(href)
  const isDark = mounted ? theme === "dark" : true
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
            <span className="text-xl font-bold text-foreground">Bling</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition-colors",
                  isActive(href) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {mounted ? (
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            ) : (
              <div className="p-2 w-9 h-9" aria-hidden />
            )}

            {user ? (
              <>
                <Link href={dashboardHref}>
                  <Button
                    variant="ghost"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    대시보드
                  </Button>
                </Link>

                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      setNotifOpen(!notifOpen)
                    }}
                    className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="알림"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-1 w-[360px] rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="font-semibold text-foreground">알림</span>
                        {unreadCount > 0 && (
                          <span className="text-sm text-primary">
                            {unreadCount}개의 새 알림
                          </span>
                        )}
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {NOTIFICATIONS_MOCK.map((n) => {
                          const Icon = NOTIFICATION_ICONS[n.type]
                          return (
                            <div
                              key={n.id}
                              className={cn(
                                "flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50",
                                n.unread && "bg-muted/20"
                              )}
                            >
                              <div className="shrink-0 mt-0.5">
                                {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                                  {n.title}
                                  {n.unread && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {n.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{n.timeAgo}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="p-2 border-t border-border">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href="#" onClick={() => setNotifOpen(false)}>
                            모든 알림 보기
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false)
                      setProfileOpen(!profileOpen)
                    }}
                    className="flex items-center gap-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors p-1 pr-2"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-sm font-bold text-primary-foreground">
                      {(me?.displayName ?? user.email ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown
                      className={cn("w-4 h-4 transition-transform", profileOpen && "rotate-180")}
                    />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-border bg-card shadow-lg py-2 z-50">
                      <div className="px-4 pb-2 mb-2 border-b border-border">
                        <p className="font-semibold text-foreground">
                          {me?.displayName ?? user.email ?? "사용자"}
                        </p>
                        {roleLabel && (
                          <p className="text-xs text-muted-foreground mt-0.5">{roleLabel}</p>
                        )}
                      </div>
                      <Link
                        href={dashboardHref}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        대시보드
                      </Link>
                      <div className="border-t border-border mt-2 pt-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isOpen}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="px-4 py-4 space-y-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block transition-colors",
                  isActive(href) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {mounted ? (
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full justify-start px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {isDark ? "라이트 모드" : "다크 모드"}
                </button>
              ) : (
                <div className="px-3 py-2 h-10" aria-hidden />
              )}
              {user ? (
                <>
                  <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                      <LayoutDashboard className="w-4 h-4" />
                      대시보드
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
