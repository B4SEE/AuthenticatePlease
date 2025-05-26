import Link from 'next/link'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 