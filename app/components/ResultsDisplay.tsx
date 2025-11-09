'use client'

import Papa from 'papaparse'

interface ResultsDisplayProps {
  report: any
  cleanedData: any[]
}

export default function ResultsDisplay({ report, cleanedData }: ResultsDisplayProps) {
  if (!report) return null

  const downloadCSV = () => {
    const csv = Papa.unparse(cleanedData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'cleaned_data.csv'
    link.click()
  }

  const downloadJSON = () => {
    const json = JSON.stringify(cleanedData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'cleaned_data.json'
    link.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Báo cáo kết quả</h2>

      <div className="space-y-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-900">Dữ liệu gốc</p>
          <p className="text-2xl font-bold text-blue-700">{report.original} dòng</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-green-900">Dữ liệu đã làm sạch</p>
          <p className="text-2xl font-bold text-green-700">{report.cleaned} dòng</p>
        </div>

        {report.duplicatesRemoved > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-yellow-900">Đã loại bỏ</p>
            <p className="text-2xl font-bold text-yellow-700">
              {report.duplicatesRemoved} dòng trùng lặp
            </p>
          </div>
        )}

        {report.missingFixed > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-purple-900">Đã sửa</p>
            <p className="text-2xl font-bold text-purple-700">
              {report.missingFixed} giá trị thiếu
            </p>
          </div>
        )}

        {report.invalidEmails > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-red-900">Email không hợp lệ</p>
            <p className="text-2xl font-bold text-red-700">{report.invalidEmails}</p>
          </div>
        )}
      </div>

      {report.aiInsights && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">
            🤖 Phân tích từ Google AI
          </h3>
          <p className="text-gray-800 whitespace-pre-wrap">{report.aiInsights}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={downloadCSV}
          className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          ⬇️ Tải về CSV
        </button>
        <button
          onClick={downloadJSON}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          ⬇️ Tải về JSON
        </button>
      </div>
    </div>
  )
}
