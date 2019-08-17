const TRAN = [2, 214, 158, 111, 249, 29, 4, 171, 208, 34, 22, 31, 216, 115, 161, 172, 59, 112, 98, 150, 30, 110, 143, 57, 157, 5, 20, 74, 166, 190, 174, 14, 207, 185, 156, 154, 199, 104, 19, 225, 45, 164, 235, 81, 141, 100, 107, 80, 35, 128, 3, 65, 236, 187, 113, 204, 122, 134, 127, 152, 242, 54, 94, 238, 142, 206, 79, 184, 50, 182, 95, 89, 220, 27, 49, 76, 123, 240, 99, 1, 108, 186, 7, 232, 18, 119, 73, 60, 218, 70, 254, 47, 121, 28, 155, 48, 227, 0, 6, 126, 46, 15, 56, 51, 33, 173, 165, 84, 202, 167, 41, 252, 90, 71, 105, 125, 197, 149, 181, 244, 11, 144, 163, 129, 109, 37, 85, 53, 245, 117, 116, 10, 38, 191, 25, 92, 26, 198, 255, 153, 93, 132, 170, 102, 62, 175, 120, 179, 32, 67, 193, 237, 36, 234, 230, 63, 24, 243, 160, 66, 87, 8, 83, 96, 195, 192, 131, 64, 130, 215, 9, 189, 68, 42, 103, 168, 147, 224, 194, 86, 159, 217, 221, 133, 21, 180, 138, 39, 40, 146, 118, 222, 239, 248, 178, 183, 201, 61, 69, 148, 75, 17, 13, 101, 213, 52, 139, 145, 12, 250, 135, 233, 124, 91, 177, 77, 229, 212, 203, 16, 162, 23, 137, 188, 219, 176, 226, 151, 136, 82, 247, 72, 211, 97, 44, 58, 43, 209, 140, 251, 241, 205, 228, 106, 231, 169, 253, 196, 55, 200, 210, 246, 223, 88, 114, 78]
const POPC = Buffer.from([0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8])

exports.Nilsimsa = class {
  constructor(data) {
    this.count = 0
    this.acc = new Array(256).fill(0)
    this.lastch0 = -1
    this.lastch1 = -1
    this.lastch2 = -1
    this.lastch3 = -1
    if (data) {
      this.update(data)
    }
  }

  static compare (hash1, hash2, encoding='hex') {
    const buf1 = Buffer.from(hash1, encoding)
    const buf2 = Buffer.from(hash2, encoding)

    if (buf1.length != buf2.length || buf1.length != 32) { // 256 bits per hash
      throw new RangeError('Invalid Nilsimsa hashes')
    }

    let bit_diff_sum = 0

    for (let byte_idx = 32; byte_idx--;) {
      bit_diff_sum += POPC[buf1[byte_idx] ^ buf2[byte_idx]]
    }

    return 128 - bit_diff_sum
  }

  tran3(a, b, c, n) {
    return ((TRAN[(a + n) & 255] ^ TRAN[b] * (n + n + 1)) + TRAN[c ^ TRAN[n]]) & 255
  }

  update(data) {
    const buffer = Buffer.from(data)
    for (const ch of buffer.values()) {
      this.count += 1
      if (this.lastch1 > -1) {
        this.acc[this.tran3(ch, this.lastch0, this.lastch1, 0)] += 1
      }
      if (this.lastch2 > -1) {
        this.acc[this.tran3(ch, this.lastch0, this.lastch2, 1)] += 1
        this.acc[this.tran3(ch, this.lastch1, this.lastch2 ,2)] += 1
      }
      if (this.lastch3 > -1) {
        this.acc[this.tran3(ch, this.lastch0, this.lastch3, 3)] += 1
        this.acc[this.tran3(ch, this.lastch1, this.lastch3 ,4)] += 1
        this.acc[this.tran3(ch, this.lastch2, this.lastch3, 5)] += 1
        this.acc[this.tran3(this.lastch3, this.lastch0, ch, 6)] += 1
        this.acc[this.tran3(this.lastch3, this.lastch2, ch, 7)] += 1
      }
      this.lastch3 = this.lastch2
      this.lastch2 = this.lastch1
      this.lastch1 = this.lastch0
      this.lastch0 = ch
    }
  }

  digest(encoding) {
    let total = 0

    switch(this.count) {
      case 0:
      case 1:
      case 2:
        break
      case 3:
        total += 1
        break
      case 4:
        total += 4
        break
      default:
        total += (8 * this.count) - 28
    }
  
    const code = Array(32).fill(0),
      threshold = total / 256

    for (let i = 0; i <= 255; i++) {
      const offset = i >> 3,
        current = code[offset]
      code[offset] = current + ((this.acc[i] > threshold ? 1 : 0 ) << (i & 7))
    }

    code.reverse()
    return Buffer.from(code).toString(encoding)
  }
}
