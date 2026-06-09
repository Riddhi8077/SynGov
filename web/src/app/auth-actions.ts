'use server'

import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function login(name: string, email: string) {
  // 1. Check if user exists in Supabase
  let { data: user, error: fetchError } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('email', email)
    .single()

  // 2. If not, auto-create them in the database
  if (!user || fetchError) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email }])
      .select('id, name, email')
      .single()

    if (insertError || !newUser) {
      console.error("Failed to create user in DB:", insertError)
      return { success: false, error: "Failed to set up user account." }
    }
    user = newUser
  }

  // 3. Store the DB UUID and details in the secure cookie
  const cookieStore = await cookies()
  cookieStore.set('syngov_user', JSON.stringify({ 
    id: user.id,
    name: user.name, 
    email: user.email 
  }), { 
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    path: '/',
  })
  
  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('syngov_user')
  return { success: true }
}

export async function getUser() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('syngov_user')
  
  if (userCookie) {
    try {
      return JSON.parse(userCookie.value)
    } catch (e) {
      return null
    }
  }
  return null
}
