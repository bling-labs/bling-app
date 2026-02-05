import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bling | 콘텐츠 라이센싱 마켓플레이스",
  description:
    "인플루언서 콘텐츠 라이센싱부터 광고 제작, 마케팅까지 한 곳에서. 숏폼 영상과 이미지를 라이센싱하고, 검색 없이 바로 광고에 활용하세요.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
