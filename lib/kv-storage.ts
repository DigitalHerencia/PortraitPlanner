// lib/kv-storage.ts

export async function setValue(key: string, value: any) {
  try {
    await localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Error setting value:", error)
    throw error
  }
}

export async function getValue(key: string) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error("Error getting value:", error)
    throw error
  }
}

