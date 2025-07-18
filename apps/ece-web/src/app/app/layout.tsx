import { SubscriptionProvider } from '@/contexts/subscription-context'
import { AppLayout } from '../../components/app-layout'

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SubscriptionProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </SubscriptionProvider>
  )
}
