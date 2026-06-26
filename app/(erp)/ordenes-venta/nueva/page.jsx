import { createClient } from '../../../../lib/supabase/server'
import NuevaOrdenForm from './NuevaOrdenForm'

export default async function NuevaOrdenPage() {
  const supabase = await createClient()
  const [{ data: clientes }, { data: estilos }, { data: colores }, { data: tallas }] = await Promise.all([
    supabase.from('clientes').select('id, nombre').eq('activo', true).order('nombre'),
    supabase.from('estilos').select('id, codigo, descripcion').eq('activo', true).order('codigo'),
    supabase.from('colores').select('id, codigo, nombre').eq('activo', true).order('nombre'),
    supabase.from('tallas').select('id, codigo').eq('activo', true).order('orden'),
  ])
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nueva Orden de Venta</h1>
        <p className="text-sm text-gray-400 mt-0.5">Complete los datos y agregue las líneas de la orden</p>
      </div>
      <NuevaOrdenForm clientes={clientes||[]} estilos={estilos||[]} colores={colores||[]} tallas={tallas||[]} />
    </div>
  )
}
