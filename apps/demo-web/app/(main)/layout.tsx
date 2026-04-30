import TabBar from '@/components/shared/TabBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <TabBar />
    </>
  )
}
