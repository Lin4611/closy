import type { BaseApiResponse } from './types'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiClientOptions<TBody = unknown> = {
  baseUrl?: string
  endpoint: string
  method?: HttpMethod
  body?: TBody
  headers?: HeadersInit
  credentials?: RequestCredentials
}

export class ApiError extends Error {
  statusCode: number
  responseBody?: unknown

  constructor(message: string, statusCode: number, responseBody?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.responseBody = responseBody
  }
}

const isFormData = (value: unknown): value is FormData => {
  return typeof FormData !== 'undefined' && value instanceof FormData
}

const isApiResponseShape = (value: unknown): value is BaseApiResponse => {
  return typeof value === 'object' && value !== null && 'status' in value
}

export const apiClient = async <TResponse, TBody = unknown>({
  baseUrl = '',
  endpoint,
  method = 'GET',
  body,
  headers,
  credentials,
}: ApiClientOptions<TBody>): Promise<TResponse> => {
  const shouldUseJsonBody = body !== undefined && !isFormData(body)
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      ...(shouldUseJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : shouldUseJsonBody
          ? JSON.stringify(body)
          : (body as BodyInit),
    credentials,
  })

  let data: unknown = null
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as { message?: unknown }).message === 'string'
        ? (data as { message: string }).message
        : '請求失敗'

    throw new ApiError(message, response.status, data)
  }

  if (isApiResponseShape(data) && data.status === false) {
    throw new ApiError(data.message || '請求失敗', data.statusCode || response.status, data)
  }

  return data as TResponse
}
