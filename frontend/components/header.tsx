"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Menu, X, User, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md dark:bg-collinear-darkBlue/80 shadow-sm"
          : "bg-white dark:bg-collinear-darkBlue"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-collinear-orange text-white font-bold">
                C
              </div>
              <span className="text-xl font-bold text-collinear-darkBlue dark:text-white">Dataset Explorer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/datasets"
              className="text-sm font-medium text-gray-700 hover:text-collinear-orange dark:text-gray-200 dark:hover:text-collinear-orange"
            >
              Datasets
            </Link>
            {user && (
              <Link
                href="/follows"
                className="text-sm font-medium text-gray-700 hover:text-collinear-orange dark:text-gray-200 dark:hover:text-collinear-orange"
              >
                My Follows
              </Link>
            )}
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-collinear-orange dark:text-gray-200 dark:hover:text-collinear-orange"
            >
              About
            </Link>
            <ModeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-collinear-orange hover:bg-collinear-orange/90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              href="/datasets"
              className="block py-2 text-base font-medium text-gray-700 hover:text-collinear-orange dark:text-gray-200 dark:hover:text-collinear-orange"
              onClick={() => setIsMenuOpen(false)}
            >
              Datasets
            </Link>
            {user && (
              <Link
                href="/follows"
                className="block py-2 text-base font-medium text-gray-700 hover:text-collinear-orange dark:text-gray-200 dark:hover:text-collinear-orange"
                onClick={() => setIsMenuOpen(false)}
              >
                My Follows
              </Link>
            )}
            <Link
              href="/about"
              className="block py-2 text-base font-medium text-gray-700 hover:text-collinear-orange dark:text-gray-200 dark:hover:text-collinear-orange"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {user ? (
              <>
                <div className="py-2 text-base font-medium text-gray-500 dark:text-gray-400">{user.name}</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start py-2 text-base font-medium text-gray-700 hover:text-collinear-orange dark:text-gray-200 dark:hover:text-collinear-orange"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="pt-4 pb-3 space-y-2">
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-collinear-orange hover:bg-collinear-orange/90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
