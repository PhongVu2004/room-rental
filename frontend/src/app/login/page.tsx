"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Home, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { fetchApi } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      
      if (response.statusCode && response.statusCode !== 200) {
        throw new Error(response.message || "Login failed")
      }
      
      login(response.access_token, response.user)
      
      // Redirect based on role
      if (response.user.role === 'ADMIN') router.push('/dashboard/admin')
      else if (response.user.role === 'LANDLORD') router.push('/dashboard/landlord')
      else router.push('/dashboard/user')
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container relative flex h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-bold text-primary-foreground">
          <Home className="mr-2 h-6 w-6" />
          RoomRent
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl text-primary-foreground font-medium leading-relaxed">
              "This platform has completely changed how I find my rental properties. The process is seamless and the options are fantastic."
            </p>
            <footer className="text-sm text-primary-foreground/80 font-semibold">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]"
        >
          <Card className="border-0 shadow-apple bg-background/50 backdrop-blur-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-center">Welcome back</CardTitle>
              <CardDescription className="text-center text-base">
                Enter your email and password to sign in to your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="grid gap-5">
                {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">{error}</div>}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-secondary/50 border-transparent focus:bg-background"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-secondary/50 border-transparent focus:bg-background"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-5 pt-4">
                <Button className="w-full h-12 text-base font-bold" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                </Button>
                <p className="px-8 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
