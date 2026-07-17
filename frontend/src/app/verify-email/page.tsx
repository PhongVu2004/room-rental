"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useSearchParams } from "next/navigation"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing verification token.")
      setLoading(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetchApi('/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token })
        })
        
        if (response.statusCode && response.statusCode >= 400) {
          throw new Error(response.message || "Failed to verify email")
        }
        
        setSuccess(true)
      } catch (err: any) {
        setError(err.message || "An error occurred during verification")
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

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
            <CardTitle className="text-3xl font-extrabold tracking-tight text-center">Email Verification</CardTitle>
            <CardDescription className="text-center text-base">
              Please wait while we verify your email address.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center py-6 text-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Verifying...</p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-2">Verified Successfully!</h3>
                <p className="text-muted-foreground mb-6">Your email has been verified. You can now access all features.</p>
                <Link href="/login" className="w-full">
                  <Button className="w-full h-12">Sign In Now</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                  <XCircle className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-destructive">Verification Failed</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link href="/login" className="w-full">
                  <Button className="w-full h-12" variant="outline">Back to Login</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
