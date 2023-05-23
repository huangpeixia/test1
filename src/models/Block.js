import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'

export const DIFFICULTY = 3
class Block {
  // 1. 完成构造函数及其参数

  constructor(blockchain,fatherHash,height,timeStamp,miner) {
    this.version=1
    this.blockchain=blockchain
    this.fatherHash=fatherHash  //父区块的哈希值
    this.height=height
    this.timeStamp=timeStamp
    this.diff=DIFFICULTY
    this.nonce=0
    this.hash=sha256(new Date().getTime().toString()).toString()
    this.utxoPool=new UTXOPool()    //此区块所含的交易信息
    this.coinbaseBeneficiary=miner   //比特币奖励
    this.miner=miner
  }

  isValid() {
      if (this.hash.toString().substring(0, this.diff) == Array(this.diff + 1).join("0"))
        return true
  }

  setNonce(){
    this.nonce++
    this.hash=sha256(this.version+this.blockchain+this.fatherHash+this.height+this.diff+this.nonce+this.hash).toString()
  }
 
}

export default Block
