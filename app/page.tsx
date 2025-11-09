'use client'

import { useState } from 'react'
import DataUploader from './components/DataUploader'
import DataPreview from './components/DataPreview'
import CleaningOptions from './components/CleaningOptions'
import ResultsDisplay from './components/ResultsDisplay'

export default function Home() {
  const [data, setData] = useState<any[]>([])
  const [cleanedData, setCleanedData] = useState<any[]>([])
  const [apiKey, setApiKey] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [report, setReport] = useState<any>(null)

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            🧹 Làm Sạch Dữ Liệu Thông Minh
          </h1>
          <p className="text-xl text-gray-700">
            Ứng dụng xử lý và làm sạch dữ liệu tự động với Google Gemini AI
          </p>
        </header>

        {/* API Key Input */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            Google AI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Nhập API key từ Google AI Studio"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
          <p className="mt-2 text-sm text-gray-600">
            Lấy API key miễn phí tại:{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-8">
            <DataUploader onDataLoaded={setData} />
            {data.length > 0 && (
              <DataPreview data={data} title="Dữ liệu gốc" />
            )}
          </div>

          {/* Cleaning Options and Results */}
          <div className="space-y-8">
            {data.length > 0 && (
              <CleaningOptions
                data={data}
                apiKey={apiKey}
                onCleaned={(cleaned, rpt) => {
                  setCleanedData(cleaned)
                  setReport(rpt)
                }}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            )}
            {cleanedData.length > 0 && (
              <>
                <DataPreview data={cleanedData} title="Dữ liệu đã làm sạch" />
                <ResultsDisplay report={report} cleanedData={cleanedData} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
