type Encoding = 'hex' | 'base64'

export class Nilsimsa {
  constructor(data?: string | Uint8Array)
  static compare(hash1: string, hash2: string, encoding?: Encoding): number
  update(data: string | Uint8Array): void
  digest(encoding?: Encoding): string
}
