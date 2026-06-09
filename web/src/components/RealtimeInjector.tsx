'use client'

import { useRealtimeSync } from '@/lib/realtime/useRealtimeSync'

export default function RealtimeInjector() {
  useRealtimeSync()
  return null
}
