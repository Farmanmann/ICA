import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'

export interface Profile {
  id: string
  role: 'borrower' | 'lender' | 'admin'
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user, loading: userLoading } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getProfile() {
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        setError(profileError.message)
        setProfile(null)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    if (!userLoading) {
      getProfile()
    }
  }, [user, userLoading, supabase])

  return { profile, loading: loading || userLoading, error }
}
