import { useState } from 'react'
import { 
  ChevronLeft, 
  LayoutDashboard, 
  FolderOpen, 
  Database, 
  CircleDot,
  Menu
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FolderOpen, label: 'Projetos', path: '/projects' },
    { icon: Database, label: 'Reservatórios', path: '/reservoirs' },
    { icon: CircleDot, label: 'Poços', path: '/wells' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div className={`bg-slate-900 text-slate-300 h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-cyan-400 font-semibold text-lg">DeepReserver</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                isActive(item.path)
                  ? 'bg-slate-800 text-cyan-400'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

    </div>
  )
}
