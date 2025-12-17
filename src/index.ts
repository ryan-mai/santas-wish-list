import { Hono } from 'hono'
import { listWishes, insertWish, fulfillWish, deleteWish, updateNote, updateScore } from './db/queries'
import { wishes } from './db/schema'


const app = new Hono()

app.get('/', (c) => {
  return c.text('Beans!')
})

app.get('/api/wishes', (c) => {
  return c.json(listWishes())
})

app.post('/api/wishes', async(c) => {
  const body = await c.req.json().catch(() => null)
  const item = (body.item ?? "").toString().trim()

  if (!item) return c.json({ error: "wish item is required" }, 400)

  return c.json( insertWish(item), 201)
})

app.patch('/api/wishes/:id/score', async(c) => {
  const body = await c.req.json().catch(() => null)
  const score = (body.score ?? 0)
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
  const res = updateScore(id, score)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)
  return c.json({ ok: true })
})

app.patch('/api/wishes/:id/fulfill', (c) => {
  const id =  Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
  
  const res = fulfillWish(id)
  if (res.changes === 0) return c.json({ error: "not found"}, 404)

  return c.json({ ok: true })
})

app.delete('/api/wishes/:id', (c) => {
  const id =  Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
  
  const res = deleteWish(id)
  if (res.changes === 0) return c.json({ error: "not found"}, 404)
    
  return c.json({ ok: true })
})

const port = Number(process.env.PORT) || 3000
export default {
  port,
  fetch: app.fetch,
}
