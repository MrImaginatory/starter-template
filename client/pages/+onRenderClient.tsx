export { onRenderClient }

import { hydrateRoot } from 'react-dom/client'
import type { OnRenderClientAsync } from 'vike/server'

const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page } = pageContext

  const container = document.getElementById('root')!
  hydrateRoot(container, <Page />)
}
