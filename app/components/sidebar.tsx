import Link from "next/link"
import { LayoutDashboard, GraduationCap, Briefcase, Settings } from 'lucide-react'

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/students", icon: GraduationCap, label: "Students" },
  { href: "/career", icon: Briefcase, label: "Career" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-2xl font-bold text-blue-600">🌿Quyl</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

