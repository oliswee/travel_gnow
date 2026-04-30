import TabBar from '@/components/shared/TabBar'
import PageTransition from '@/components/shared/PageTransition'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTransition>{children}</PageTransition>
      <TabBar />
    </>
  )
}
