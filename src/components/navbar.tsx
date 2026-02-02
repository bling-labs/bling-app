"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sparkles, Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

const NAV_LINKS = [
  { href: "/contents", label: "콘텐츠" },
  { href: "/contest", label: "컨테스트" },
  { href: "/influencers", label: "인플루언서" },
] as const

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const mounted = useHasMounted()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const isActive = (href: string) => pathname.startsWith(href)

  const isDark = mounted ? theme === "dark" : true

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
            <span className="text-xl font-bold text-foreground">Bling</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition-colors",
                  isActive(href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
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
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              로그인
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
              회원가입
            </Button>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="px-4 py-4 space-y-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block transition-colors",
                  isActive(href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
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
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                로그인
              </Button>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                회원가입
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
