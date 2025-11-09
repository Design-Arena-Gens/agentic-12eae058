import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { data, options, apiKey } = await request.json()

    let cleanedData = [...data]
    let report: any = {
      original: data.length,
      cleaned: 0,
      duplicatesRemoved: 0,
      missingFixed: 0,
      invalidEmails: 0,
      aiInsights: null,
    }

    // 1. Remove duplicates
    if (options.removeDuplicates) {
      const uniqueData = Array.from(
        new Map(cleanedData.map((item) => [JSON.stringify(item), item])).values()
      )
      report.duplicatesRemoved = cleanedData.length - uniqueData.length
      cleanedData = uniqueData
    }

    // 2. Handle missing values
    if (options.handleMissing) {
      cleanedData = cleanedData.map((row) => {
        const newRow = { ...row }
        let fixedCount = 0

        Object.keys(newRow).forEach((key) => {
          const value = newRow[key]
          if (
            value === null ||
            value === undefined ||
            value === '' ||
            value === 'N/A' ||
            value === 'null' ||
            value === 'undefined'
          ) {
            // Try to infer type and provide default
            const otherValues = cleanedData
              .map((r) => r[key])
              .filter((v) => v && v !== '' && v !== 'N/A')

            if (otherValues.length > 0) {
              // Check if numeric
              const numericValues = otherValues.filter((v) => !isNaN(Number(v)))
              if (numericValues.length > otherValues.length * 0.5) {
                // Numeric field - use median
                const nums = numericValues.map(Number).sort((a, b) => a - b)
                newRow[key] = nums[Math.floor(nums.length / 2)]
                fixedCount++
              } else {
                // Text field - use most common value
                const counts: any = {}
                otherValues.forEach((v) => {
                  counts[v] = (counts[v] || 0) + 1
                })
                newRow[key] = Object.keys(counts).reduce((a, b) =>
                  counts[a] > counts[b] ? a : b
                )
                fixedCount++
              }
            }
          }
        })

        if (fixedCount > 0) {
          report.missingFixed += fixedCount
        }

        return newRow
      })
    }

    // 3. Normalize text
    if (options.normalizeText) {
      cleanedData = cleanedData.map((row) => {
        const newRow: any = {}
        Object.keys(row).forEach((key) => {
          const value = row[key]
          if (typeof value === 'string') {
            // Trim whitespace
            let normalized = value.trim()
            // Normalize email to lowercase
            if (key.toLowerCase().includes('email')) {
              normalized = normalized.toLowerCase()
            }
            // Capitalize names properly
            if (key.toLowerCase().includes('name')) {
              normalized = normalized
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            }
            newRow[key] = normalized
          } else {
            newRow[key] = value
          }
        })
        return newRow
      })
    }

    // 4. Validate emails
    if (options.validateEmails) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      cleanedData.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (key.toLowerCase().includes('email')) {
            const email = row[key]
            if (email && !emailRegex.test(email)) {
              report.invalidEmails++
            }
          }
        })
      })
    }

    // 5. Detect outliers in numeric fields
    if (options.detectOutliers) {
      const numericFields: string[] = []
      Object.keys(cleanedData[0] || {}).forEach((key) => {
        const values = cleanedData.map((r) => r[key])
        const numericValues = values.filter((v) => !isNaN(Number(v)))
        if (numericValues.length > values.length * 0.5) {
          numericFields.push(key)
        }
      })

      // For each numeric field, detect outliers using IQR method
      numericFields.forEach((field) => {
        const values = cleanedData
          .map((r) => Number(r[field]))
          .filter((v) => !isNaN(v))
          .sort((a, b) => a - b)

        if (values.length > 4) {
          const q1 = values[Math.floor(values.length * 0.25)]
          const q3 = values[Math.floor(values.length * 0.75)]
          const iqr = q3 - q1
          const lowerBound = q1 - 1.5 * iqr
          const upperBound = q3 + 1.5 * iqr

          cleanedData = cleanedData.filter((row) => {
            const value = Number(row[field])
            return isNaN(value) || (value >= lowerBound && value <= upperBound)
          })
        }
      })
    }

    report.cleaned = cleanedData.length

    // 6. Use Google AI for insights
    if (options.useAI && apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const sampleData = cleanedData.slice(0, 5)
        const prompt = `Phân tích dữ liệu sau và đưa ra các nhận xét về chất lượng dữ liệu, các vấn đề tiềm ẩn, và gợi ý cải thiện. Trả lời bằng tiếng Việt một cách ngắn gọn (2-3 câu):

Dữ liệu mẫu:
${JSON.stringify(sampleData, null, 2)}

Thống kê:
- Dữ liệu gốc: ${report.original} dòng
- Đã loại bỏ: ${report.duplicatesRemoved} dòng trùng lặp
- Đã sửa: ${report.missingFixed} giá trị thiếu
- Email không hợp lệ: ${report.invalidEmails}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        report.aiInsights = response.text()
      } catch (error) {
        console.error('AI Error:', error)
        report.aiInsights = 'Không thể lấy phân tích từ AI. Vui lòng kiểm tra API key.'
      }
    }

    return NextResponse.json({ cleanedData, report })
  } catch (error) {
    console.error('Error in clean API:', error)
    return NextResponse.json(
      { error: 'Lỗi khi xử lý dữ liệu' },
      { status: 500 }
    )
  }
}
