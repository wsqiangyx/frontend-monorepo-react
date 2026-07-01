import { describe, expect, it } from 'vitest'
import { validateUploadFile } from '../upload'
import { ApiError } from '../types'

function createFile(size: number, type: string): File {
  const file = new File(['x'], 'test.bin', { type })
  Object.defineProperty(file, 'size', { value: size, configurable: true })
  return file
}

describe('validateUploadFile', () => {
  it('throws ApiError when file exceeds maxFileSize', () => {
    const file = createFile(1024, 'text/plain')

    expect(() => validateUploadFile(file, { maxFileSize: 100 })).toThrow(
      new ApiError('FILE_TOO_LARGE', '文件大小超过限制（最大 100 字节）', 0),
    )
  })

  it('throws ApiError when MIME type is not allowed', () => {
    const file = createFile(100, 'image/png')

    expect(() => validateUploadFile(file, { allowedMimeTypes: ['application/pdf'] })).toThrow(
      new ApiError('INVALID_FILE_TYPE', '不支持的文件类型：image/png', 0),
    )
  })

  it('does not throw when file passes validation', () => {
    const file = createFile(100, 'application/pdf')

    expect(() =>
      validateUploadFile(file, {
        maxFileSize: 1024,
        allowedMimeTypes: ['application/pdf'],
      }),
    ).not.toThrow()
  })

  it('allows any file when validation options are not set', () => {
    const file = createFile(1024 * 1024 * 100, 'application/octet-stream')

    expect(() => validateUploadFile(file, {})).not.toThrow()
  })
})
