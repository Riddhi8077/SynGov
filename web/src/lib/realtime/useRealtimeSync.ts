'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useRealtimeSync() {
  const router = useRouter()

  useEffect(() => {
    // Listen to changes on the proposals table
    const proposalsChannel = supabase
      .channel('public:proposals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, (payload) => {
        console.log('Realtime change in proposals:', payload)
        router.refresh()
      })
      .subscribe()

    // Listen to changes on the votes table
    const votesChannel = supabase
      .channel('public:votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, (payload) => {
        console.log('Realtime change in votes:', payload)
        router.refresh()
      })
      .subscribe()

    // Listen to changes on the users table (scores updating, etc)
    const usersChannel = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        console.log('Realtime change in users:', payload)
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(proposalsChannel)
      supabase.removeChannel(votesChannel)
      supabase.removeChannel(usersChannel)
    }
  }, [router])
}
