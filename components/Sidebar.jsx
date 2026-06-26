'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { section: 'Principal', items: [{ href: '/dashboard', icon: '📊', label: 'Dashboard' }] },
  {
    section: 'Ventas',
    items: [
      { href: '/ordenes-venta', icon: '🛒', label: 'Órdenes de Venta' },
      { href: '/clientes', icon: '👥', label: 'Clientes' },
      { href: '/embarques', icon: '🚢', label: 'Embarques' },
    ],
  },
  {
    section: 'Producción',
    items: [
      { href: '/produccion', icon: '⚙️', label: 'Órdenes de Prod.' },
      { href: '/wip', icon: '📋', label: 'WIP / Avance' },
      { href: '/lotes', icon: '📦', label: 'Lotes' },
      { href: '/tickets', icon: '🏷️', label: 'Tickets / Etiquetas' },
    ],
  },
  {
    section: 'Inventario',
    items: [
      { href: '/inventario', icon: '🗄️', label: 'Inventario MP' },
      { href: '/inventario-pt', icon: '✅', label: 'Inventario PT' },
      { href: '/compras', icon: '🛍️', label: 'Órdenes de Compra' },
    ],
  },
  {
    section: 'Catálogos',
    items: [
      { href: '/estilos', icon: '👕', label: 'Estilos / BOM' },
      { href: '/materiales', icon: '🎨', label: 'Materiales' },
      { href: '/proveedores', icon: '🏭', label: 'Proveedores' },
    ],
  },
]

export default function Sidebar({ user }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-60 bg-gray-800 flex flex-col flex-shrink-0 overflow-y-auto">
      {nav.map(({ section, items }) => (
        <div key={section}>
          <div className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {section}
          </div>
          {items.map(({ href, icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-md text-sm transition-colors mb-0.5 ${
                  active
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            )
          })}
        </div>
      ))}

      {/* User / logout at bottom */}
      <div className="mt-auto p-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 truncate mb-2">{user?.email}</div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-gray-700"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
