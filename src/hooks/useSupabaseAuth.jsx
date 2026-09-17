import { useContext } from 'react'
import { SupabaseAuthContext } from '../contexts/SupabaseAuthContext'

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}