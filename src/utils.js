import sha256 from 'crypto-js/sha256.js'

export const validateHash = (hash) => {
  if (hash != undefined){
    return true
  }
  return false
}

export const calcNonce = (block) => {
  console.log(`calc nonce of block ${block.height} `)
  const start = new Date().getTime()
  let calcTimes = 0
  while (!block.isValid()) {
    block.setNonce()
    calcTimes++
  }
  const end = new Date().getTime()
  console.log(
    `calc nonce cost ${(end - start) / 1000}s, try ${calcTimes} times`,
  )
  return block
}
