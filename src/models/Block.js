import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 3
class Block {
  // 1. 完成构造函数及其参数

  constructor(blockchain,fatherHash,height,timeStamp) {
    this.version=1
    this.blockchain=blockchain
    this.fatherHash=fatherHash  //父区块的哈希值
    this.height=height
    this.timeStamp=timeStamp
    this.diff=DIFFICULTY
    this.nonce=0
    this.hash=sha256(new Date().getTime().toString()).toString()
  }

  isValid() {
      if (this.hash.toString().substring(0, this.diff) == Array(this.diff + 1).join("0"))
        return true
  }

  setNonce(nonce){
    this.nonce++
    this.hash=sha256(this.version+this.blockchain+this.fatherHash+this.height+nonce+this.diff+this.nonce+this.hash).toString()
  }
 
}

export default Block
