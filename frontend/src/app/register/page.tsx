"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Home, Loader2 } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("GUEST")
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaVerified) {
      setError("Please verify that you are not a robot.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const response = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: `${firstName} ${lastName}`, email, password, role })
      })
      
      if (response.statusCode && response.statusCode !== 201) {
        throw new Error(response.message || "Registration failed")
      }
      
      setIsSuccess(true)
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
              "Joining this platform as a host has doubled my bookings in just one month. The dashboard is incredibly intuitive."
            </p>
            <footer className="text-sm text-primary-foreground/80 font-semibold">Minh T.</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]"
        >
          <Card className="border-0 shadow-apple bg-background/50 backdrop-blur-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-center">
                {isSuccess ? "Check your email" : "Create an account"}
              </CardTitle>
              <CardDescription className="text-center text-base">
                {isSuccess 
                  ? "We've sent a verification link to your email." 
                  : "Enter your details below to create your account"}
              </CardDescription>
            </CardHeader>
            {isSuccess ? (
              <CardContent className="flex flex-col items-center py-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <p className="text-muted-foreground mb-6">
                  Please click the link in the email to verify your account before logging in.
                </p>
                <Link href="/login" className="w-full">
                  <Button className="w-full h-12">Go to Login</Button>
                </Link>
              </CardContent>
            ) : (
              <form onSubmit={handleRegister}>
                <CardContent className="grid gap-5">
                  {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">{error}</div>}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required className="h-12 bg-secondary/50 border-transparent focus:bg-background" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} required className="h-12 bg-secondary/50 border-transparent focus:bg-background" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 bg-secondary/50 border-transparent focus:bg-background" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="h-12 bg-secondary/50 border-transparent focus:bg-background" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>I want to sign up as a:</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-secondary/50 transition-colors">
                        <input type="radio" name="role" value="GUEST" checked={role === "GUEST"} onChange={() => setRole("GUEST")} className="accent-primary" />
                        <span className="font-medium">Guest</span>
                      </label>
                      <label className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-secondary/50 transition-colors">
                        <input type="radio" name="role" value="LANDLORD" checked={role === "LANDLORD"} onChange={() => setRole("LANDLORD")} className="accent-primary" />
                        <span className="font-medium">Landlord</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center p-3 border rounded-lg bg-secondary/30">
                      <input 
                        type="checkbox" 
                        id="captcha" 
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary mr-3 cursor-pointer"
                        checked={captchaVerified}
                        onChange={(e) => {
                          setCaptchaVerified(e.target.checked)
                          if (e.target.checked && error === "Please verify that you are not a robot.") setError("")
                        }}
                      />
                      <Label htmlFor="captcha" className="cursor-pointer font-medium select-none flex-1 flex items-center">
                        I'm not a robot
                        <div className="ml-auto w-6 h-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ display: captchaVerified ? 'none' : 'block' }}></div>
                        <svg className="ml-auto w-6 h-6 text-green-500" style={{ display: captchaVerified ? 'block' : 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </Label>
                    </div>
                  </div>
                  
                </CardContent>
                <CardFooter className="flex flex-col gap-5 pt-4">
                  <Button className="w-full h-12 text-base font-bold" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create account"}
                  </Button>
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
