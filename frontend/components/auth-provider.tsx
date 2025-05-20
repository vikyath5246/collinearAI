"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Mock authentication - in a real app, this would call your API
      if (email && password) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock user data
        const userData = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0],
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))

        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${userData.name}!`,
        })

        router.push("/datasets")
      } else {
        throw new Error("Please provide email and password")
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      // Mock registration - in a real app, this would call your API
      if (email && password && name) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock user data
        const userData = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          name,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))

        toast({
          title: "Account created successfully",
          description: `Welcome, ${name}!`,
        })

        router.push("/datasets")
      } else {
        throw new Error("Please provide all required information")
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    })
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
