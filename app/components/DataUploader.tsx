'use client'

import { useState } from 'react'
import Papa from 'papaparse'

interface DataUploaderProps {
  onDataLoaded: (data: any[]) => void
}

export default function DataUploader({ onDataLoaded }: DataUploaderProps) {
  const [fileName, setFileName] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onDataLoaded(results.data)
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
          alert('Lỗi khi đọc file CSV')
        },
      })
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          onDataLoaded(Array.isArray(json) ? json : [json])
        } catch (error) {
          console.error('Error parsing JSON:', error)
          alert('Lỗi khi đọc file JSON')
        }
      }
      reader.readAsText(file)
    } else {
      alert('Vui lòng chọn file CSV hoặc JSON')
    }
  }

  const handlePasteData = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    if (!text.trim()) return

    try {
      // Try parsing as JSON first
      const json = JSON.parse(text)
      onDataLoaded(Array.isArray(json) ? json : [json])
      setFileName('Dữ liệu đã dán (JSON)')
    } catch {
      // If not JSON, try parsing as CSV
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onDataLoaded(results.data)
          setFileName('Dữ liệu đã dán (CSV)')
        },
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 Tải dữ liệu lên</h2>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Chọn file (CSV hoặc JSON)
        </label>
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
        />
        {fileName && (
          <p className="mt-2 text-sm text-green-600">✓ Đã tải: {fileName}</p>
        )}
      </div>

      {/* Paste Data */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Hoặc dán dữ liệu trực tiếp
        </label>
        <textarea
          placeholder="Dán dữ liệu CSV hoặc JSON vào đây..."
          onChange={handlePasteData}
          className="w-full h-32 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Sample Data Button */}
      <button
        onClick={() => {
          const sampleData = [
            { name: 'Nguyễn Văn A', email: 'nguyen.a@example.com', age: '25', salary: '10000000' },
            { name: 'Trần Thị B', email: 'TRAN.B@EXAMPLE.COM', age: '', salary: '15000000' },
            { name: 'Lê Văn C', email: 'le.c@invalid', age: '30', salary: 'N/A' },
            { name: 'Phạm Thị D', email: 'pham.d@example.com', age: '28', salary: '12000000' },
            { name: 'Nguyễn Văn A', email: 'nguyen.a@example.com', age: '25', salary: '10000000' }, // duplicate
          ]
          onDataLoaded(sampleData)
          setFileName('Dữ liệu mẫu')
        }}
        className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Sử dụng dữ liệu mẫu
      </button>
    </div>
  )
}
