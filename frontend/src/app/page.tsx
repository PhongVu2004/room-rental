"use client"

import { Button } from "@/components/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, Home, Star, ArrowRight } from "lucide-react"
import { Input } from "@/components/input"

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center space-y-8 text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium bg-primary/5 text-primary backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Over 1,000+ new listings today
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6 max-w-4xl">
              <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
                Find your next <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 drop-shadow-sm">
                  perfect space.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl leading-relaxed tracking-tight">
                Experience the modern way to rent. Fast, secure, and beautifully designed for both tenants and landlords.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-xl p-2 bg-background/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-stripe flex items-center mt-8 ring-1 ring-black/5 dark:ring-white/5">
              <div className="flex-1 px-4 flex items-center">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground outline-none text-lg tracking-tight"
                  placeholder="Where do you want to live?"
                  type="text"
                />
              </div>
              <Button className="rounded-xl px-8 h-12 shadow-md hover:shadow-lg transition-all" size="lg">
                Search
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-32 bg-secondary/30 border-t border-border/50">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="group flex flex-col items-start space-y-4 p-8 bg-card rounded-[2rem] shadow-sm border border-border/50 hover:shadow-stripe hover:border-primary/20 transition-all duration-500">
              <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Verified Spaces</h3>
              <p className="text-muted-foreground leading-relaxed">Every room is meticulously verified by our team to ensure quality, safety, and peace of mind.</p>
            </div>
            
            <div className="group flex flex-col items-start space-y-4 p-8 bg-card rounded-[2rem] shadow-sm border border-border/50 hover:shadow-stripe hover:border-primary/20 transition-all duration-500">
              <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Smart Filters</h3>
              <p className="text-muted-foreground leading-relaxed">Instantly narrow down options by price, amenities, and commute times to find exactly what you need.</p>
            </div>
            
            <div className="group flex flex-col items-start space-y-4 p-8 bg-card rounded-[2rem] shadow-sm border border-border/50 hover:shadow-stripe hover:border-primary/20 transition-all duration-500">
              <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Real Reviews</h3>
              <p className="text-muted-foreground leading-relaxed">Transparent and authentic feedback from past tenants helps you make informed decisions.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
