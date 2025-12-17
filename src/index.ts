import { Hono } from 'hono'
import { listWishes, insertWish, fulfillWish, deleteWish, updateNote, updateScore } from './db/queries'
import { wishes } from './db/schema'


const app = new Hono()

app.get('/', (c) => {
  return c.text('Beans!')
})

app.get('/api/wishes', async (c) => {
  try {
    const data = await listWishes()
    return c.json(data)
  } catch (err) {
    console.error(err)
    return c.json({ error: "internal" }, 500)
  }
})

app.post('/api/wishes', async(c) => {
  try {
    const body = await c.req.json().catch(() => ({}))
    const item = (body.item ?? "").toString().trim()

    if (!item) return c.json({ error: "wish item is required" }, 400)

    const inserted = await insertWish(item)
    return c.json(inserted, 201)
  } catch (err) {
    console.error(err)
    return c.json({ error: "internal" }, 500)
  }
})

app.patch('/api/wishes/:id/score', async(c) => {
  try {
    const body = await c.req.json().catch(() => ({}))
    const score = (body.score ?? 0)
    const id = Number(c.req.param("id"))
    if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
    const res = await updateScore(id, score)
    if (res.changes === 0) return c.json({ error: "not found" }, 404)
    return c.json({ ok: true })
  } catch (err) {
    console.error(err)
    return c.json({ error: "internal" }, 500)
  }
})

app.patch('/api/wishes/:id/fulfill', async (c) => {
  try {
    const id =  Number(c.req.param("id"))
    if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
    
    const res = await fulfillWish(id)
    if (res.changes === 0) return c.json({ error: "not found"}, 404)

    return c.json({ ok: true })
  } catch (err) {
    console.error(err)
    return c.json({ error: "internal" }, 500)
  }
})

app.delete('/api/wishes/:id', async (c) => {
  try {
    const id =  Number(c.req.param("id"))
    if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
    
    const res = await deleteWish(id)
    if (res.changes === 0) return c.json({ error: "not found"}, 404)
      
    return c.json({ ok: true })
  } catch (err) {
    console.error(err)
    return c.json({ error: "internal" }, 500)
  }
})

const port = Number(process.env.PORT) || 3000
export default {
  port,
  fetch: app.fetch,
}
