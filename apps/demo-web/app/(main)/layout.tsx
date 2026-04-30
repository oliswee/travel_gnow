import TabBar from '@/components/shared/TabBar'
import PageTransition from '@/components/shared/PageTransition'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <PageTransition>{children}</PageTransition>
      </div>
      <TabBar />
    </div>
  )
}
