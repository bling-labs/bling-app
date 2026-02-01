import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ContestPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">컨테스트 페이지 (추후 구현)</p>
      </div>
      <Footer />
    </main>
  )
}
