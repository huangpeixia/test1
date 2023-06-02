import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'

export const DIFFICULTY = 3
class Block {
  // 1. 完成构造函数及其参数

  constructor(blockchain,fatherHash,height,timeStamp,pubKey) {
    this.version=1
    this.blockchain=blockchain
    this.fatherHash=fatherHash  //父区块的哈希值
    this.height=height
    this.timeStamp=timeStamp
    this.diff=DIFFICULTY
    this.nonce=0
    this.hash=sha256(new Date().getTime().toString()).toString()
    this.utxoPool=new UTXOPool()    //此区块所含的交易信息
    this.coinbaseBeneficiary=pubKey   //比特币奖励
    this.tree=[]
  }

  isValid() {
      if (this.hash.toString().substring(0, this.diff) == Array(this.diff + 1).join("0"))
        return true
  }

  setNonce(){
    this.nonce++
    this.hash=sha256(this.version+this.blockchain+this.fatherHash+this.height+this.diff+this.nonce+this.hash).toString()
  }

  // 根据交易变化更新区块 hash
  _setHash() {
    this.hash=sha256(this.version+this.blockchain+this.fatherHash+this.height+this.diff+this.nonce+this.hash+this.utxoPool+this.coinbaseBeneficiary).toString()
  }

  // 汇总计算交易的 Hash 值
  /**
   * 默克尔树实现
   */
  combinedTransactionsHash() {
    if (this.tree.length != 0){
      this.tree = []
    }
    return this._combinedTransactionsHash()
  }

  _combinedTransactionsHash() {
    let len = Object.keys(this.utxoPool.utxos).length
    let hash1 = ''
    let j = 0
    for(let key in this.utxoPool.utxos){
      hash1 = sha256(hash1 + key+this.utxoPool.utxos[key]).toString()
      j++
      if (j % 2 != 0){
        continue
      }else{
        this.tree.push(hash1)
        hash1 = ''
      }
    }
    if (len % 2 != 0) {
      this.tree.push(sha256(this.utxoPool.utxos[length - 1]).toString())
      j++
    }
    if(this.tree.length == 1){
      return this.tree[0]
    }else{
      this.combinedTransactionsHash(this.tree.slice(this.tree.length - j, this.tree.length))
    }
  }

  // 添加交易到区块
  /**
   * 
   * 需包含 UTXOPool 的更新与 hash 的更新
   */
  addTransaction(trx) {
    this.utxoPool.handleTransaction(trx)
    this.hash=this._setHash()
  }
 
}

export default Block
