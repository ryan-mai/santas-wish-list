import { db } from "./index"
import { wishes } from "./schema"
import { eq, desc } from "drizzle-orm"

export function listWishes() {
    return db.select().from(wishes).orderBy(desc(wishes.id)).all()
}

export function insertWish(item: string) {
    const createdAt = Math.floor(Date.now() / 1000)
    const res = db.insert(wishes).values({
        item,
        notes: "",
        fulfilled: 0,
        createdAt,
    }).run()
    
    const runRes = res as unknown as { lastInsertRowid?: number }
    return { id: Number(runRes.lastInsertRowid ?? 0)}
}

export function updateNote(id: number, text: string) {
    const res = db.update(wishes).set({ notes: text }).where(eq(wishes.id, id)).run()
    const runRes = res as unknown as { changes?: string }
    return { changes: runRes.changes ?? 0 }    
}

export function updateScore(id: number, s: number) {
    const res = db.update(wishes).set({ score: s }).where(eq(wishes.id, id)).run()
    const runRes = res as unknown as { changes?: number }
    return { changes: runRes.changes ?? 0 }    
}

export function fulfillWish(id: number) {
    const res = db.update(wishes)
        .set({ fulfilled: 1 }) //1 = true
        .where(eq(wishes.id, id))
        .run()
    
    const runRes = res as unknown as { changes?: number }
    return { changes: runRes.changes ?? 0 }
}

export function deleteWish(id: number) {
    const res = db.delete(wishes).where(eq(wishes.id, id)).run()
    const runRes = res as unknown as { changes?: number }
    return { changes: runRes.changes ?? 0 }
}