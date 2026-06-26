import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

export default async function ErpLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get tenant info
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol, tenants(nombre)')
    .eq('id', user.id)
    .single()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-blue-950 text-white flex items-center px-5 gap-4 flex-shrink-0 shadow z-10">
        <div className="font-bold text-lg tracking-tight">
          Im<span className="text-blue-400">prove</span>
          <span className="text-xs font-normal text-blue-300 ml-1.5">Cloud</span>
        </div>
        {usuario?.tenants?.nombre && (
          <div className="bg-white/15 rounded px-2.5 py-0.5 text-xs ml-1">
            {usuario.tenants.nombre}
          </div>
        )}
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="text-blue-200 text-xs">{usuario?.nombre || user.email}</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-content-center text-xs font-bold flex items-center justify-center">
            {(usuario?.nombre || user.email || '?')[0].toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
