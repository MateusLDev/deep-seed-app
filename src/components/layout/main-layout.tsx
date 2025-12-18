import { Outlet } from 'react-router-dom'
import { Sidebar } from '../ui/sidebar'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
