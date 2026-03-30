export type ApiResponse<TData> = {
  statusCode: number
  status: boolean
  message: string
  data: TData
}

export type BaseApiResponse = {
  statusCode?: number
  status?: boolean
  message?: string
}
