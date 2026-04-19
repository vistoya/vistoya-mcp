#!/usr/bin/env node

/**
 * npx @vistoya/mcp
 *
 * Auto-configures the Vistoya fashion MCP server for Claude Desktop,
 * Claude Code, Cursor, Windsurf, and VS Code.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

const MCP_URL = 'https://api.vistoya.com/mcp'
const HOME = process.env.HOME || process.env.USERPROFILE
const IS_MAC = process.platform === 'darwin'
const IS_WIN = process.platform === 'win32'

// ─── Client configs ─────────────────────────────────────────────────

const CLIENTS = [
  {
    name: 'Claude Desktop',
    path: IS_MAC
      ? join(HOME, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
      : IS_WIN
        ? join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json')
        : null,
    format: 'mcpServers',
    entry: { url: MCP_URL },
  },
  {
    name: 'Claude Code',
    path: join(HOME, '.claude', 'settings.json'),
    format: 'mcpServers',
    entry: { url: MCP_URL },
  },
  {
    name: 'Cursor',
    path: join(HOME, '.cursor', 'mcp.json'),
    format: 'mcpServers',
    entry: { url: MCP_URL },
  },
  {
    name: 'Windsurf',
    path: join(HOME, '.windsurf', 'mcp.json'),
    format: 'mcpServers',
    entry: { url: MCP_URL },
  },
  {
    name: 'VS Code',
    path: join(HOME, '.vscode', 'mcp.json'),
    format: 'servers',
    entry: { type: 'http', url: MCP_URL },
  },
]

// ─── Helpers ────────────────────────────────────────────────────────

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
}

function writeJson(path, data) {
  const dir = join(path, '..')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    })
  })
}

function isInstalled(client) {
  if (!client.path) return false
  // Client is "installed" if its config file or parent dir exists
  const dir = join(client.path, '..')
  return existsSync(client.path) || existsSync(dir)
}

function isAlreadyConfigured(client) {
  const config = readJson(client.path)
  if (!config) return false
  const section = config[client.format]
  return section && section.vistoya != null
}

function configure(client) {
  const config = readJson(client.path) || {}
  if (!config[client.format]) config[client.format] = {}
  config[client.format].vistoya = client.entry
  writeJson(client.path, config)
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log()
  console.log('  Vistoya MCP — fashion product search for AI agents')
  console.log('  https://vistoya.com')
  console.log()

  const detected = CLIENTS.filter(isInstalled)

  if (detected.length === 0) {
    console.log('  No supported AI clients detected.')
    console.log()
    console.log('  You can manually add this to your MCP config:')
    console.log()
    console.log('    "vistoya": { "url": "' + MCP_URL + '" }')
    console.log()
    process.exit(0)
  }

  const alreadyDone = detected.filter(isAlreadyConfigured)
  const toConfigure = detected.filter((c) => !isAlreadyConfigured(c))

  if (alreadyDone.length > 0) {
    console.log('  Already configured:')
    for (const c of alreadyDone) console.log('    ' + c.name)
    console.log()
  }

  if (toConfigure.length === 0) {
    console.log('  All detected clients are already set up. You\'re good!')
    console.log()
    process.exit(0)
  }

  console.log('  Detected clients to configure:')
  for (const c of toConfigure) console.log('    ' + c.name)
  console.log()

  const answer = await ask('  Configure all? [Y/n] ')
  if (answer === 'n' || answer === 'no') {
    console.log('  Skipped. You can configure manually — see README.')
    console.log()
    process.exit(0)
  }

  let configured = 0
  for (const client of toConfigure) {
    try {
      configure(client)
      console.log('  + ' + client.name)
      configured++
    } catch (err) {
      console.log('  ! ' + client.name + ' — ' + err.message)
    }
  }

  console.log()
  if (configured > 0) {
    console.log('  Done! Restart your AI client to activate Vistoya.')
    console.log()
    console.log('  Try asking: "Find me a black leather jacket under $300"')
  }
  console.log()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
