import ModelEditorClient from './ModelEditorClient'

// Required for static export - admin pages are client-side only
export function generateStaticParams() {
  return []
}

export default function ModelEditorPage() {
  return <ModelEditorClient />
}
