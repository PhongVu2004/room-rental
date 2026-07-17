"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { ArrowLeft, Loader2, MailCheck } from "lucide-react"
import { fetchApi } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetchApi('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      })
      
      if (response.statusCode && response.statusCode >= 400) {
        throw new Error(response.message || "Something went wrong")
      }
      
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container relative flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]"
      >
        <Card className="border-0 shadow-apple bg-background/50 backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          
          {success ? (
            <CardContent className="flex flex-col items-center py-6 text-center">
               <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <MailCheck className="h-8 w-8" />
               </div>
               <h3 className="font-bold text-xl mb-2">Check your email</h3>
               <p className="text-muted-foreground mb-6">We've sent a password reset link to <span className="font-medium text-foreground">{email}</span></p>
               <Link href="/login" className="w-full">
                  <Button className="w-full h-12">Return to Login</Button>
               </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-5">
                {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">{error}</div>}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
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
              </CardContent>
              <CardFooter className="flex flex-col gap-5 pt-4">
                <Button className="w-full h-12 text-base font-bold" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Reset Link"}
                </Button>
                <Link href="/login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
