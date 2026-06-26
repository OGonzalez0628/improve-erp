import './globals.css'

export const metadata = {
  title: 'Improve ERP',
  description: 'Improve ERP — Sistema de gestión para manufactura',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
