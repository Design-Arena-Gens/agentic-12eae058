'use client'

interface DataPreviewProps {
  data: any[]
  title: string
}

export default function DataPreview({ data, title }: DataPreviewProps) {
  if (!data || data.length === 0) return null

  const columns = Object.keys(data[0])
  const previewData = data.slice(0, 5) // Show first 5 rows

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Tổng số: {data.length} dòng | Hiển thị: {previewData.length} dòng đầu
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {row[col] !== null && row[col] !== undefined && row[col] !== ''
                      ? String(row[col])
                      : <span className="text-gray-400 italic">trống</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
