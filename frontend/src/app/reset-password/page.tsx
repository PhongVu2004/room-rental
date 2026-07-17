"use client"

import { Suspense, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Loader2, CheckCircle2 } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useSearchParams } from "next/navigation"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (!token) {
      setError("Invalid or missing reset token")
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      const response = await fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      })
      
      if (response.statusCode && response.statusCode >= 400) {
        throw new Error(response.message || "Failed to reset password")
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
            <CardTitle className="text-3xl font-extrabold tracking-tight text-center">Reset Password</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          
          {success ? (
            <CardContent className="flex flex-col items-center py-6 text-center">
               <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
               </div>
               <h3 className="font-bold text-xl mb-2">Password Updated</h3>
               <p className="text-muted-foreground mb-6">Your password has been successfully reset. You can now sign in with your new password.</p>
               <Link href="/login" className="w-full">
                  <Button className="w-full h-12">Sign In</Button>
               </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-5">
                {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">{error}</div>}
                
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-secondary/50 border-transparent focus:bg-background"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 bg-secondary/50 border-transparent focus:bg-background"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col pt-4">
                <Button className="w-full h-12 text-base font-bold" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
