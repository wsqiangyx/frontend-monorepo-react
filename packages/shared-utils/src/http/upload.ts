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
  /** 最大文件大小（字节）。未设置时不校验。 */
  maxFileSize?: number
  /** 允许的 MIME 类型列表。未设置时不校验。 */
  allowedMimeTypes?: string[]
}

/**
 * 校验待上传文件是否满足大小与类型限制。
 * 在校验通过时静默返回，否则抛出 ApiError。
 */
export function validateUploadFile(file: File | Blob, config: UploadConfig): void {
  const { maxFileSize, allowedMimeTypes } = config

  if (maxFileSize !== undefined && file.size > maxFileSize) {
    throw new ApiError('FILE_TOO_LARGE', `文件大小超过限制（最大 ${maxFileSize} 字节）`, 0)
  }

  if (allowedMimeTypes !== undefined && allowedMimeTypes.length > 0) {
    const actualType = file.type
    if (!allowedMimeTypes.includes(actualType)) {
      throw new ApiError('INVALID_FILE_TYPE', `不支持的文件类型：${actualType || 'unknown'}`, 0)
    }
  }
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

  validateUploadFile(file, config)

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
