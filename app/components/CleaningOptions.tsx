'use client'

import { useState } from 'react'

interface CleaningOptionsProps {
  data: any[]
  apiKey: string
  onCleaned: (cleanedData: any[], report: any) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export default function CleaningOptions({
  data,
  apiKey,
  onCleaned,
  isProcessing,
  setIsProcessing,
}: CleaningOptionsProps) {
  const [options, setOptions] = useState({
    removeDuplicates: true,
    handleMissing: true,
    normalizeText: true,
    validateEmails: true,
    detectOutliers: true,
    useAI: true,
  })

  const handleClean = async () => {
    if (!apiKey && options.useAI) {
      alert('Vui lòng nhập Google AI API Key để sử dụng tính năng AI')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/clean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          options,
          apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xử lý dữ liệu')
      }

      const result = await response.json()
      onCleaned(result.cleanedData, result.report)
    } catch (error) {
      console.error('Error cleaning data:', error)
      alert('Có lỗi xảy ra khi làm sạch dữ liệu')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Tùy chọn làm sạch</h2>

      <div className="space-y-3 mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.removeDuplicates}
            onChange={(e) =>
              setOptions({ ...options, removeDuplicates: e.target.checked })
            }
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">Loại bỏ dữ liệu trùng lặp</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.handleMissing}
            onChange={(e) =>
              setOptions({ ...options, handleMissing: e.target.checked })
            }
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">Xử lý dữ liệu thiếu</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.normalizeText}
            onChange={(e) =>
              setOptions({ ...options, normalizeText: e.target.checked })
            }
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">Chuẩn hóa định dạng văn bản</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.validateEmails}
            onChange={(e) =>
              setOptions({ ...options, validateEmails: e.target.checked })
            }
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">Kiểm tra email hợp lệ</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.detectOutliers}
            onChange={(e) =>
              setOptions({ ...options, detectOutliers: e.target.checked })
            }
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">Phát hiện giá trị bất thường</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.useAI}
            onChange={(e) =>
              setOptions({ ...options, useAI: e.target.checked })
            }
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">
            Sử dụng Google AI để phân tích thông minh
          </span>
        </label>
      </div>

      <button
        onClick={handleClean}
        disabled={isProcessing}
        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang xử lý...
          </span>
        ) : (
          '🚀 Bắt đầu làm sạch dữ liệu'
        )}
      </button>
    </div>
  )
}
