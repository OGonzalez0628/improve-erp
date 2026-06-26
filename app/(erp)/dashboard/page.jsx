import { createClient } from '../../../lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: totalOV }, { count: enProd }, { count: completadas }] = await Promise.all([
    supabase.from('ordenes_venta').select('*', { count: 'exact', head: true }).neq('status', 'cancelada'),
    supabase.from('ordenes_produccion').select('*', { count: 'exact', head: true }).eq('status', 'en_proceso'),
    supabase.from('ordenes_venta').select('*', { count: 'exact', head: true }).eq('status', 'completa'),
  ])

  const { data: recentOV } = await supabase
    .from('ordenes_venta')
    .select('id, numero, status, created_at, clientes(nombre)')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: activeOPs } = await supabase
    .from('ordenes_produccion')
    .select('id, numero, cantidad, status, estilos(descripcion)')
    .eq('status', 'en_proceso')
    .limit(4)

  const statusLabels = {
    borrador:       { label: 'Borrador',       cls: 'bg-gray-100 text-gray-600' },
    confirmada:     { label: 'Confirmada',     cls: 'bg-blue-100 text-blue-700' },
    en_produccion:  { label: 'En Producción',  cls: 'bg-purple-100 text-purple-700' },
    parcial:        { label: 'Parcial',        cls: 'bg-amber-100 text-amber-700' },
    completa:       { label: 'Completa',       cls: 'bg-green-100 text-green-700' },
    cancelada:      { label: 'Cancelada',      cls: 'bg-red-100 text-red-600' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <a href="/ordenes-venta" className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Nueva Orden
        </a>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: '🛒', label: 'Órdenes activas',  value: totalOV ?? 0,    bg: 'bg-blue-50' },
          { icon: '⚙️', label: 'OP en proceso',    value: enProd ?? 0,     bg: 'bg-purple-50' },
          { icon: '✅', label: 'Completadas',       value: completadas ?? 0, bg: 'bg-green-50' },
          { icon: '🟢', label: 'Sistema',           value: 'Activo',        bg: 'bg-amber-50' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-xl`}>{icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-800">Últimas Órdenes de Venta</span>
            <a href="/ordenes-venta" className="text-xs text-blue-600 hover:underline">Ver todas</a>
          </div>
          {recentOV && recentOV.length > 0 ? (
            <table className="w-full text-sm">
              <tbody>
                {recentOV.map(ov => {
                  const s = statusLabels[ov.status] || { label: ov.status, cls: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={ov.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-blue-700">{ov.numero}</div>
                        <div className="text-xs text-gray-400">{ov.clientes?.nombre}</div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">
              No hay órdenes aún.<br />
              <a href="/ordenes-venta" className="text-blue-600 hover:underline mt-1 inline-block">Crear primera orden →</a>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-800">Producción en Proceso</span>
          </div>
          {activeOPs && activeOPs.length > 0 ? (
            <div className="p-4 space-y-4">
              {activeOPs.map(op => (
                <div key={op.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{op.numero}</span>
                    <span className="text-gray-400 text-xs">{op.estilos?.descripcion?.substring(0, 28)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-xs text-gray-400">En proceso</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">
              No hay órdenes de producción en proceso.<br />
              <a href="/produccion" className="text-blue-600 hover:underline mt-1 inline-block">Ver producción →</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
