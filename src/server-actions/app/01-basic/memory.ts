const memory:string[] = []

export function getMemory() : string[] {
  return memory
}

export function saveMemory(value: string) {
  memory.push(value)
}