import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Làm Sạch Dữ Liệu Thông Minh - Smart Data Cleaner',
  description: 'Ứng dụng làm sạch và xử lý dữ liệu tự động với Google AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
