// GitHub API utilities for admin panel

const REPO_OWNER = 'tsubome'
const REPO_NAME = 'AIwiki'
const BRANCH = 'master'

interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  type: 'file' | 'dir'
  content?: string
}

interface GitHubCommitResponse {
  commit: {
    sha: string
    html_url: string
  }
}

// Get authentication token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('github_token')
}

// Make authenticated GitHub API request
async function githubFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken()
  if (!token) {
    throw new Error('認証されていません')
  }

  const url = endpoint.startsWith('https://')
    ? endpoint
    : `https://api.github.com${endpoint}`

  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

// List files in a directory
export async function listFiles(path: string): Promise<GitHubFile[]> {
  const response = await githubFetch(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`
  )

  if (!response.ok) {
    throw new Error(`Failed to list files: ${response.statusText}`)
  }

  return response.json()
}

// Get file content
export async function getFileContent(path: string): Promise<{ content: string; sha: string }> {
  const response = await githubFetch(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`
  )

  if (!response.ok) {
    throw new Error(`Failed to get file: ${response.statusText}`)
  }

  const data = await response.json()

  // Decode base64 content with proper UTF-8 handling
  const binaryString = atob(data.content.replace(/\n/g, ''))
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  const content = new TextDecoder('utf-8').decode(bytes)

  return {
    content,
    sha: data.sha,
  }
}

// Create or update a file
export async function saveFile(
  path: string,
  content: string,
  message: string,
  sha?: string // Required for updates, omit for new files
): Promise<GitHubCommitResponse> {
  const response = await githubFetch(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(content))), // Encode to base64 (with UTF-8 support)
        branch: BRANCH,
        ...(sha && { sha }),
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to save file: ${error.message || response.statusText}`)
  }

  return response.json()
}

// Delete a file
export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  const response = await githubFetch(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
    {
      method: 'DELETE',
      body: JSON.stringify({
        message,
        sha,
        branch: BRANCH,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to delete file: ${error.message || response.statusText}`)
  }
}

// Get all model families
export async function getModelFamilies(): Promise<string[]> {
  const files = await listFiles('data/models')
  return files.filter(f => f.type === 'dir').map(f => f.name)
}

// Get family data
export async function getFamilyData(family: string): Promise<{
  family: unknown
  tree: unknown | null
  models: Array<{ name: string; slug: string; data: unknown }>
}> {
  // Get _family.json
  const familyFile = await getFileContent(`data/models/${family}/_family.json`)
  const familyData = JSON.parse(familyFile.content)

  // Try to get _tree.json
  let treeData = null
  try {
    const treeFile = await getFileContent(`data/models/${family}/_tree.json`)
    treeData = JSON.parse(treeFile.content)
  } catch {
    // Tree file may not exist
  }

  // Get all model files
  const files = await listFiles(`data/models/${family}`)
  const modelFiles = files.filter(
    f => f.type === 'file' && f.name.endsWith('.json') && !f.name.startsWith('_')
  )

  const models = await Promise.all(
    modelFiles.map(async f => {
      const content = await getFileContent(`data/models/${family}/${f.name}`)
      return {
        name: f.name.replace('.json', ''),
        slug: f.name.replace('.json', ''),
        data: JSON.parse(content.content),
      }
    })
  )

  return {
    family: familyData,
    tree: treeData,
    models,
  }
}

// Get family metadata (just _family.json)
export async function getFamilyMetadata(family: string): Promise<{
  data: unknown
  sha: string
}> {
  const file = await getFileContent(`data/models/${family}/_family.json`)
  return {
    data: JSON.parse(file.content),
    sha: file.sha,
  }
}

// Save family metadata
export async function saveFamilyMetadata(
  family: string,
  data: unknown,
  sha?: string
): Promise<GitHubCommitResponse> {
  const content = JSON.stringify(data, null, 2) + '\n'
  const message = sha
    ? `Update family: ${family}`
    : `Add new family: ${family}`

  return saveFile(
    `data/models/${family}/_family.json`,
    content,
    message,
    sha
  )
}

// Get single model data
export async function getModelData(family: string, modelSlug: string): Promise<{
  data: unknown
  sha: string
}> {
  const file = await getFileContent(`data/models/${family}/${modelSlug}.json`)
  return {
    data: JSON.parse(file.content),
    sha: file.sha,
  }
}

// Save model data
export async function saveModelData(
  family: string,
  modelSlug: string,
  data: unknown,
  sha?: string
): Promise<GitHubCommitResponse> {
  const content = JSON.stringify(data, null, 2) + '\n'
  const message = sha
    ? `Update model: ${modelSlug}`
    : `Add new model: ${modelSlug}`

  return saveFile(
    `data/models/${family}/${modelSlug}.json`,
    content,
    message,
    sha
  )
}

// Delete model
export async function deleteModel(
  family: string,
  modelSlug: string,
  sha: string
): Promise<void> {
  return deleteFile(
    `data/models/${family}/${modelSlug}.json`,
    sha,
    `Delete model: ${modelSlug}`
  )
}

// Check if a family exists
export async function familyExists(family: string): Promise<boolean> {
  try {
    await listFiles(`data/models/${family}`)
    return true
  } catch {
    return false
  }
}

// Create a new family
export async function createFamily(
  family: string,
  displayName: string,
  developer?: string
): Promise<GitHubCommitResponse> {
  const familyData = {
    name: displayName,
    slug: family,
    developer: developer || 'Unknown',
    description: {
      ja: '',
      en: ''
    }
  }

  const content = JSON.stringify(familyData, null, 2) + '\n'
  return saveFile(
    `data/models/${family}/_family.json`,
    content,
    `Create new family: ${family}`
  )
}

// Get current user info
export async function getCurrentUser(): Promise<{ login: string; avatar_url: string }> {
  const response = await githubFetch('/user')
  if (!response.ok) {
    throw new Error('Failed to get user info')
  }
  return response.json()
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken()
}

// Logout
export function logout(): void {
  localStorage.removeItem('github_token')
}

// Get recent commits
export interface CommitInfo {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

export async function getRecentCommits(limit: number = 10): Promise<CommitInfo[]> {
  const response = await githubFetch(
    `/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=${BRANCH}&per_page=${limit}`
  )

  if (!response.ok) {
    throw new Error(`Failed to get commits: ${response.statusText}`)
  }

  const commits = await response.json()
  return commits.map((commit: {
    sha: string
    commit: {
      message: string
      author: { name: string; date: string }
    }
    html_url: string
  }) => ({
    sha: commit.sha.substring(0, 7),
    message: commit.commit.message.split('\n')[0], // First line only
    author: commit.commit.author.name,
    date: commit.commit.author.date,
    url: commit.html_url,
  }))
}
