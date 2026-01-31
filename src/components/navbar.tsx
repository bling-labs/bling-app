"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
            <Link
              href="#contents"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              콘텐츠
            </Link>
            <Link
              href="#influencers"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              인플루언서
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              로그인
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
              회원가입
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
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
            <Link
              href="#contents"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              콘텐츠
            </Link>
            <Link
              href="#influencers"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              인플루언서
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
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
