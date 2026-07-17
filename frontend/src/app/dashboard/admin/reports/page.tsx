"use client"

import { motion } from "framer-motion"
import { Download, FileText, TrendingUp, Users } from "lucide-react"

export default function AdminReports() {
  const reports = [
    {
      id: 1,
      title: "Monthly Financial Summary",
      description: "Detailed breakdown of platform revenue, landlord payouts, and platform fees for the current month.",
      type: "financial",
      date: "Generated today"
    },
    {
      id: 2,
      title: "User Growth Report Q3",
      description: "Analysis of new user registrations, demographics, and user retention over the last quarter.",
      type: "users",
      date: "Generated 2 days ago"
    },
    {
      id: 3,
      title: "Property Performance Insights",
      description: "Data on most popular districts, average booking duration, and occupancy rates.",
      type: "analytics",
      date: "Generated 1 week ago"
    }
  ]

  const getIcon = (type: string) => {
    switch(type) {
      case 'financial': return <TrendingUp className="h-6 w-6 text-green-500" />
      case 'users': return <Users className="h-6 w-6 text-blue-500" />
      default: return <FileText className="h-6 w-6 text-purple-500" />
    }
  }

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Reports & Exports</h1>
            <p className="text-muted-foreground">Download comprehensive system and financial reports.</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Generate Custom
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <div className="bg-background rounded-2xl shadow-sm border border-border p-6 hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col group">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  {getIcon(report.type)}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{report.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {report.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{report.date}</span>
                  <button className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">
                    Download <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
