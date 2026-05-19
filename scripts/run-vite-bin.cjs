// ============================================================================
// run-vite-bin.cjs — 统一 Vite/Vitest 启动器
// ============================================================================
// 解决的核心问题：
//   1. Windows 兼容性：child_process.exec 可能混入系统命令（如 net use），
//      导致 MSW/Vitest 在 Windows 上卡死。此脚本通过补丁拦截这些命令。
//   2. 统一入口：所有 workspace 通过 node ../../scripts/vite.cjs 启动，
//      而非直接调用 vite/vitest，确保跨平台行为一致。
//   3. 路径解析：从 workspace 的 package.json 中解析 bin 字段，
//      避免硬编码全局安装路径。
//
// 调用链：
//   scripts/vite.cjs → run('vite') → 解析 bin 路径 → import(真实 bin)
//   scripts/vitest.cjs → run('vitest') → 同上
// ============================================================================
const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')
const { pathToFileURL } = require('node:url')

/**
 * 启动指定的 Vite/Vitest bin。
 * @param {string} binName - bin 名称，如 'vite' 或 'vitest'
 */
function run(binName) {
  if (!binName) {
    console.error('Missing bin name.')
    process.exit(1)
  }

  // 保存原始的 childProcess.exec 引用
  const originalExec = childProcess.exec

  // 屏蔽 Windows 下可能混入启动链路的 `net use` 探测，减少 Vite/Vitest 兼容性问题。
  // 在 Windows 上，某些网络环境会导致 child_process.exec 被意外调用执行
  // `net use` 命令（可能是 MSW 或 Vitest 依赖的库触发的），这会导致进程卡死。
  // 补丁策略：拦截所有 `net use` 调用，返回空结果，让调用方以为命令成功。
  childProcess.exec = function patchedExec(command, options, callback) {
    if (typeof command === 'string' && command.trim().toLowerCase() === 'net use') {
      // 从参数中提取回调函数（options 可以是 callback）
      const cb =
        typeof options === 'function' ? options : typeof callback === 'function' ? callback : null

      if (cb) {
        // 使用 nextTick 异步返回空结果，模拟命令成功执行
        process.nextTick(() => cb(null, '', ''))
      }

      // 返回一个假 child_process 对象，避免调用方访问 kill/pid 时崩溃
      return {
        kill() {},
        pid: 0,
      }
    }

    // 非 `net use` 命令：正常执行原始的 childProcess.exec
    return originalExec.call(childProcess, command, options, callback)
  }

  // ---- bin 路径解析 ----
  // 从目标包的 package.json 中读取 bin 字段，解析出可执行文件的绝对路径。
  // require.resolve 会按照 Node 模块解析算法查找包路径，
  // paths 参数指定从当前工作目录和仓库根目录开始查找。
  const packageJsonPath = require.resolve(`${binName}/package.json`, {
    paths: [process.cwd(), path.resolve(__dirname, '..')],
  })
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  // bin 字段可以是字符串（单一入口）或对象（多入口，按 bin 名选择）
  const binEntry =
    typeof packageJson.bin === 'string' ? packageJson.bin : packageJson.bin?.[binName]

  if (!binEntry) {
    console.error(`Unable to resolve bin entry for: ${binName}`)
    process.exit(1)
  }

  // 重新执行真实 bin，保证所有 workspace 都走统一包装入口。
  const binPath = path.resolve(path.dirname(packageJsonPath), binEntry)

  // ---- argv 重写 ----
  // 将 process.argv 从 [node, scripts/vite.cjs, ...用户参数]
  // 重写为 [node, 真实bin路径, ...用户参数]
  // 这样 Vite/Vitest 内部读取 argv 时能获取正确的命令路径
  process.argv = [process.argv[0], binPath, ...process.argv.slice(2)]

  // ---- 动态导入执行 ----
  // Windows 上 import() 要求 file:// URL（而非文件路径），
  // pathToFileURL 将 Windows 反斜杠路径转为 file:///D:/... 格式
  void import(pathToFileURL(binPath).href)
}

module.exports = { run }
