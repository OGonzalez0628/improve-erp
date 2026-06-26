'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'

export default function NuevaOrdenForm({ clientes, estilos, colores, tallas }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    numero: 'OV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-4),
    cliente_id: '',
    fecha: new Date().toISOString().slice(0, 10),
    fecha_entrega: '',
    moneda: 'USD',
    notas: '',
  })
  const [lineas, setLineas] = useState([
    { estilo_id: '', color_id: '', talla_id: '', cantidad: '', precio_unit: '' }
  ])

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function setLinea(i, k, v) {
    setLineas(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l))
  }

  function addLinea() {
    setLineas(ls => [...ls, { estilo_id: '', color_id: '', talla_id: '', cantidad: '', precio_unit: '' }])
  }

  function removeLinea(i) {
    setLineas(ls => ls.filter((_, idx) => idx !== i))
  }

  const total = lineas.reduce((sum, l) => sum + ((+l.cantidad || 0) * (+l.precio_unit || 0)), 0)

  async function handleSubmit(status) {
    if (!form.cliente_id) { setError('Selecciona un cliente'); return }
    if (lineas.some(l => !l.estilo_id || !l.color_id || !l.talla_id || !l.cantidad)) {
      setError('Completa todos los campos de cada línea'); return
    }
    setLoading(true); setError('')
    const supabase = createClient()

    const { data: ov, error: ovErr } = await supabase
      .from('ordenes_venta')
      .insert({ ...form, status })
      .select('id')
      .single()

    if (ovErr) { setError(ovErr.message); setLoading(false); return }

    const lineasData = lineas.map((l, i) => ({
      tenant_id: ov.tenant_id,
      orden_id: ov.id,
      linea: i + 1,
      estilo_id: l.estilo_id,
      color_id: l.color_id,
      talla_id: l.talla_id,
      cantidad: +l.cantidad,
      precio_unit: +l.precio_unit || null,
      status: 'abierta',
    }))

    // Get tenant_id from the created order
    const { data: ovFull } = await supabase.from('ordenes_venta').select('tenant_id').eq('id', ov.id).single()
    const lineasFinal = lineasData.map(l => ({ ...l, tenant_id: ovFull?.tenant_id }))

    const { error: linErr } = await supabase.from('ordenes_venta_lineas').insert(lineasFinal)
    if (linErr) { setError(linErr.message); setLoading(false); return }

    router.push('/ordenes-venta')
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {/* Header fields */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Datos generales</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">NÚMERO</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.numero} onChange={e => setField('numero', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">CLIENTE *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.cliente_id} onChange={e => setField('cliente_id', e.target.value)}>
              <option value="">Seleccionar cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">FECHA</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.fecha} onChange={e => setField('fecha', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">FECHA ENTREGA</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.fecha_entrega} onChange={e => setField('fecha_entrega', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">MONEDA</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.moneda} onChange={e => setField('moneda', e.target.value)}>
              <option>USD</option><option>MXN</option>
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">NOTAS</label>
            <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              value={form.notas} onChange={e => setField('notas', e.target.value)}
              placeholder="Instrucciones especiales de empaque, etiquetado, etc." />
          </div>
        </div>
      </div>

      {/* Lines */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Líneas de la orden</h2>
          <button onClick={addLinea} className="text-sm text-blue-700 hover:text-blue-900 font-medium">+ Agregar línea</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">#</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Estilo</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Color</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Talla</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Cantidad</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Precio unit.</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Total</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((l, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2">
                    <select className="border border-gray-200 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={l.estilo_id} onChange={e => setLinea(i, 'estilo_id', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {estilos.map(e => <option key={e.id} value={e.id}>{e.codigo} — {e.descripcion}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select className="border border-gray-200 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={l.color_id} onChange={e => setLinea(i, 'color_id', e.target.value)}>
                      <option value="">Color...</option>
                      {colores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select className="border border-gray-200 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={l.talla_id} onChange={e => setLinea(i, 'talla_id', e.target.value)}>
                      <option value="">Talla...</option>
                      {tallas.map(t => <option key={t.id} value={t.id}>{t.codigo}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min="0" placeholder="0"
                      className="border border-gray-200 rounded px-2 py-1.5 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={l.cantidad} onChange={e => setLinea(i, 'cantidad', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min="0" step="0.01" placeholder="0.00"
                      className="border border-gray-200 rounded px-2 py-1.5 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={l.precio_unit} onChange={e => setLinea(i, 'precio_unit', e.target.value)} />
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-700">
                    ${((+l.cantidad || 0) * (+l.precio_unit || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-2">
                    {lineas.length > 1 && (
                      <button onClick={() => removeLinea(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">✕</button>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={6} className="px-3 py-3 text-right text-gray-600 text-sm">TOTAL DE LA ORDEN</td>
                <td className="px-3 py-3 text-blue-800 text-base">
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} {form.moneda}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-3 justify-end">
        <button onClick={() => router.back()} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
          Cancelar
        </button>
        <button onClick={() => handleSubmit('borrador')} disabled={loading}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Guardar borrador
        </button>
        <button onClick={() => handleSubmit('confirmada')} disabled={loading}
          className="px-4 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
          {loading ? 'Guardando...' : '✓ Confirmar orden'}
        </button>
      </div>
    </div>
  )
}
