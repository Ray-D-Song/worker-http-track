export default {
  async fetch(request, env) {
    return handleRequest(request, env)
  }
}

async function handleRequest(request, env) {
  // 读取环境变量中的转发目的地
  const FORWARD_URL = env.FORWARD_URL

  if (!FORWARD_URL) {
    return new Response('未设置转发 URL', { status: 500 })
  }

  // 创建一个新的请求对象,用于转发
  const forwardRequest = new Request(FORWARD_URL, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })

  // 转发请求并获取响应
  const response = await fetch(forwardRequest)

  // 创建一个数组来存储请求和响应信息
  let info = []

  // 添加请求信息
  info.push('请求信息:')
  info.push(`方法: ${request.method}`)
  info.push(`URL: ${request.url}`)
  info.push('请求头:')
  for (let [key, value] of request.headers) {
    info.push(`  ${key}: ${value}`)
  }

  // 添加响应信息
  info.push('\n响应信息:')
  info.push(`状态: ${response.status}`)
  info.push('响应头:')
  for (let [key, value] of response.headers) {
    info.push(`  ${key}: ${value}`)
  }

  // 尝试读取响应体
  try {
    const responseBody = await response.text()
    info.push('响应体:')
    info.push(responseBody)
  } catch (error) {
    info.push('无法读取响应体')
  }

  // 将所有信息连接成一个字符串
  const logInfo = info.join('\n')

  // 打印日志信息（在 Cloudflare Workers 中会显示在 "日志" 选项卡中）
  console.log(logInfo)

  // 返回原始响应
  return response
}
