import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
)

app.use(cors())

app.get('/:slug', async (req, res) => {
  const slug = req.params.slug

  const { data, error } = await supabase
    .from('posts') 
    .select('*')
    .eq('slugTitle', slug)
    .limit(1)
    .single()

  if (error || !data) {
    return res.status(404).send('Not found')
  }

  const { title, description, imageUrl } = data

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="https://tkdqllo.netlify.app/publication/${slug}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${imageUrl}" />
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
      </body>
    </html>
  `

  res.setHeader('Content-Type', 'text/html')
  res.send(html)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
