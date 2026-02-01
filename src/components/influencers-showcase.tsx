import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, ImageIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const influencers = [
  {
    name: "김수민",
    handle: "@beautykim",
    category: "뷰티·스킨케어",
    followers: "85K",
    contents: 124,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
  },
  {
    name: "박준호",
    handle: "@fitjohn",
    category: "피트니스·헬스",
    followers: "92K",
    contents: 98,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
  },
  {
    name: "이지은",
    handle: "@daily_vibe",
    category: "라이프스타일",
    followers: "156K",
    contents: 203,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
  },
  {
    name: "최민재",
    handle: "@style_log",
    category: "패션·스타일",
    followers: "67K",
    contents: 87,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
  },
]

export function InfluencersShowcase() {
  return (
    <section id="influencers" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              인기 인플루언서
            </h2>
            <p className="text-muted-foreground max-w-xl">
              검증된 크리에이터들의 프로필을 확인하고 콘텐츠를 둘러보세요
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary/90 group self-start sm:self-auto">
            <Link href="/influencers">
              전체 보기
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Influencer Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {influencers.map((influencer) => (
            <InfluencerCard key={influencer.handle} influencer={influencer} />
          ))}
        </div>
      </div>
    </section>
  )
}

function InfluencerCard({ influencer }: { influencer: (typeof influencers)[0] }) {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all">
      {/* Cover Image */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={influencer.coverImage || "/placeholder.svg"}
          alt={influencer.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Profile */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div className="absolute -top-8 left-4">
          <div className="relative h-16 w-16 rounded-full border-4 border-card overflow-hidden">
            <Image
              src={influencer.image || "/placeholder.svg"}
              alt={influencer.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-10">
          <h3 className="font-semibold text-foreground">{influencer.name}</h3>
          <p className="text-sm text-primary">{influencer.handle}</p>

          {/* Category Badge */}
          <div className="inline-block mt-2 px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground">
            {influencer.category}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{influencer.followers}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              <span>{influencer.contents}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-foreground font-medium">{influencer.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
