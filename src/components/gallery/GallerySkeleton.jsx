/**
 * Skeleton shimmer loading placeholders for the masonry gallery grid
 */
export default function GallerySkeleton({ count = 8 }) {
  // Varying aspect ratios to simulate natural masonry
  const aspectRatios = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-[16/10]', 'aspect-[1/1]', 'aspect-[4/5]']

  return (
    <div className="columns-1 min-[480px]:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => {
        const ratio = aspectRatios[i % aspectRatios.length]
        return (
          <div
            key={i}
            className={`break-inside-avoid mb-4 sm:mb-6 rounded-2xl overflow-hidden bg-white/60 border border-[rgba(180,160,130,0.25)] p-2 shadow-sm`}
          >
            <div className={`w-full ${ratio} rounded-xl overflow-hidden relative bg-black/5 animate-pulse`}>
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                }}
              />
            </div>
            <div className="pt-2 px-1 pb-1 space-y-1.5 animate-pulse">
              <div className="h-3.5 bg-black/10 rounded-md w-3/4" />
              <div className="h-2.5 bg-black/5 rounded-md w-1/2" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

