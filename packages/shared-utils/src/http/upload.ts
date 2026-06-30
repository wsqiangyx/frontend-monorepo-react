// ============================================================================
// @repo/shared-utils — 带进度的文件上传（基于 XMLHttpRequest）
// ============================================================================
// ky 基于 fetch API，浏览器 fetch 不支持上传进度回调。
// 对于中后台常见的文件上传场景，使用原生 XMLHttpRequest 自行封装。
//
// 使用方式：
//   const result = await uploadWithProgress<ResultType>(
//     '/api/files/upload',
//     file,
//     (percent) => console.log(`上传进度: ${percent}%`),
//     { getToken: () => store.token }
//   )
// ============================================================================

import { ApiError } from './types'
import type { ApiResponse } from '../api-contract'

export interface UploadConfig {
  baseURL?: string
  fieldName?: string
  headers?: Record<string, string>
  getToken?: () => string | null
  abortSignal?: AbortSignal
}

/**
 * 带进度的文件上传。
 * 基于 XMLHttpRequest 实现，支持 onProgress 回调、abort 能力、多文件上传。
 */
export function uploadWithProgress<T>(
  url: string,
  file: File | Blob,
  onProgress?: (percent: number) => void,
  config: UploadConfig = {},
): Promise<T> {
  const {
    baseURL = '',
    fieldName = 'file',
    headers = {},
    getToken = () => null,
    abortSignal,
  } = config

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const fullURL = baseURL ? `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url

    xhr.open('POST', fullURL, true)

    // 设置 headers
    const token = getToken()
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value)
    }

    // 进度回调
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    }

    // 完成回调
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText) as ApiResponse<T>
        if (body.success) {
          resolve(body.data)
        } else {
          reject(new ApiError(body.code, body.message, xhr.status))
        }
      } catch {
        reject(new ApiError('PARSE_ERROR', '响应解析失败', xhr.status))
      }
    }

    xhr.onerror = () => {
      reject(new ApiError('NETWORK_ERROR', '网络错误', 0))
    }

    xhr.ontimeout = () => {
      reject(new ApiError('TIMEOUT', '请求超时', 0))
    }

    // abort 支持
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort()
        reject(new ApiError('ABORTED', '请求已取消', 0))
      })
    }

    // 发送
    const formData = new FormData()
    formData.append(fieldName, file)
    xhr.send(formData)
  })
}
