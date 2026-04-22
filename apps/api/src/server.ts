import { env } from '@webhooks/env'
import { buildApp } from './app.js'

buildApp()
  .then(app => {
    app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    })
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
    console.log('📚️ Documentation running on http://localhost:3333/docs')
  })
