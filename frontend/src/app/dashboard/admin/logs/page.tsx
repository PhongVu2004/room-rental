"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Info, ShieldAlert } from "lucide-react"

export default function AdminLogs() {
  const logs = [
    {
      id: "LOG-001",
      level: "critical",
      message: "Multiple failed login attempts detected for user 'admin@example.com'.",
      source: "AuthService",
      timestamp: "10 mins ago",
      ip: "192.168.1.104"
    },
    {
      id: "LOG-002",
      level: "info",
      message: "Room ID 'clx981m0' created by landlord 'landlord1@example.com'.",
      source: "RoomService",
      timestamp: "1 hour ago",
      ip: "10.0.0.52"
    },
    {
      id: "LOG-003",
      level: "warning",
      message: "Database connection pool reached 80% capacity.",
      source: "Database",
      timestamp: "3 hours ago",
      ip: "127.0.0.1"
    },
    {
      id: "LOG-004",
      level: "info",
      message: "System backup completed successfully.",
      source: "BackupService",
      timestamp: "12 hours ago",
      ip: "127.0.0.1"
    },
    {
      id: "LOG-005",
      level: "info",
      message: "User 'student1@example.com' updated profile.",
      source: "UserService",
      timestamp: "1 day ago",
      ip: "172.16.254.1"
    }
  ]

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">System Logs</h1>
            <p className="text-muted-foreground">Monitor platform security and activity logs in real-time.</p>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Search logs..." className="px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition shadow-sm text-sm">
              Filter
            </button>
          </div>
        </div>

        <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors font-mono text-sm">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.level === 'critical' ? (
                      <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-xs font-bold"><ShieldAlert className="w-3 h-3" /> CRITICAL</span>
                    ) : log.level === 'warning' ? (
                      <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md text-xs font-bold"><AlertTriangle className="w-3 h-3" /> WARN</span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md text-xs font-bold"><Info className="w-3 h-3" /> INFO</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-foreground font-semibold">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 text-foreground/80">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
