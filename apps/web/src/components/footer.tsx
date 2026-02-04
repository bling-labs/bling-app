"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

const footerLinks = {
  platform: {
    title: "플랫폼",
    links: [
      { label: "콘텐츠 탐색", href: "#" },
      { label: "캠페인", href: "/campaigns" },
      { label: "인플루언서", href: "#" },
      { label: "가격 정책", href: "#" },
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#" },
    ],
  },
  support: {
    title: "지원",
    links: [
      { label: "고객센터", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "파트너 문의", href: "#" },
      { label: "채용", href: "#" },
    ],
  },
  social: {
    title: "소셜",
    links: [
      { label: "Instagram", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Twitter", href: "#" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <Sparkles className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
              <span className="text-xl font-bold text-foreground">Bling</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Bling은 인플루언서와 광고주를 연결하는 콘텐츠 라이센싱 마켓플레이스입니다. 디지털마케팅의 새로운 가능성을 경험하세요.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Bling. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              이용약관
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
