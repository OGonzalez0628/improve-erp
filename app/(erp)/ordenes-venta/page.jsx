import { createClient } from '../../../lib/supabase/server'
import Link from 'next/link'

const STATUS = {
  borrador:      { label: 'Borrador',      cls: 'bg-gray-100 text-gray-600' },
  confirmada:    { label: 'Confirmada',    cls: 'bg-blue-100 text-blue-700' },
  en_produccion: { label: 'En Producción', cls: 'bg-purple-100 text-purple-700' },
  parcial:       { label: 'Parcial',       cls: 'bg-amber-100 text-amber-700' },
  completa:      { label: 'Completa',      cls: 'bg-green-100 text-green-700' },
  cancelada:     { label: 'Cancelada',     cls: 'bg-red-100 text-red-600' },
}

export default async function OrdenesVentaPage() {
  const supabase = await createClient()

  const { data: ordenes, error } = await supabase
    .from('ordenes_venta')
    .select(`
      id, numero, fecha, fecha_entrega, status, moneda, notas,
      clientes(nombre)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Venta</h1>
          <p className="text-sm text-gray-400 mt-0.5">{ordenes?.length ?? 0} órdenes registradas</p>
        </div>
        <Link
          href="/ordenes-venta/nueva"
          className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Orden
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {ordenes && ordenes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Número</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Entrega</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map(ov => {
                  const s = STATUS[ov.status] || { label: ov.status, cls: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={ov.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-blue-700">{ov.numero}</td>
                      <td className="px-4 py-3 text-gray-700">{ov.clientes?.nombre || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{ov.fecha || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{ov.fecha_entrega || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/ordenes-venta/${ov.id}`} className="text-xs text-blue-600 hover:underline mr-3">Ver</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-gray-500 text-sm mb-4">No hay órdenes de venta registradas.</p>
            <Link href="/ordenes-venta/nueva" className="bg-blue-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Crear primera orden
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
