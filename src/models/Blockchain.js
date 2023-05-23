// Blockchain
import UTXOPool from './UTXOPool.js'

class Blockchain {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含 
      - 名字
      - 创世区块
      - 存储区块的映射
  */

  constructor(name) {
    this.name=name
    this.genesis=""
    this.blocks={}  //存储键值对
  }

  // 2. 定义 longestChain 函数
  /* 
    返回当前链中最长的区块信息列表
  */
  longestChain(genesisBlock) {

    let longest = []
    let blocks = genesisBlock.blockchain.blocks  //键值对  key是哈希值,[key]是block
    //console.log(blocks)
    let num = 0

    for(let key in blocks){//添加block
      if (blocks[key].fatherHash == genesisBlock.hash && blocks[key] != genesisBlock){
        num++
        if (num > 1){
          let newBlocks = longest
          let lastBlock = newBlocks.pop()
          newBlocks.push(blocks[key])
          newBlocks = newBlocks.concat(this.longestChain(blocks[key]))
          for(let h in blocks){
            if(blocks[h].height == lastBlock.height + 1){
              longest = longest.concat(this.longestChain(blocks[h]))
            }
          }
          if(newBlocks.length > longest.length ){
            return newBlocks
          }
        }else{
          longest.push(blocks[key])
          longest = longest.concat(this.longestChain(blocks[key]))
        }
      }

    }
    return longest
  }

    // 判断当前区块链是否包含
    containsBlock(block) {
      // 添加判断方法
      let blocks = block.blockchain.blocks
      for (let key in blocks){
        if(blocks[key] == block){
          return true
        }
      }
      return false
    }

     // 获得区块高度最高的区块
  maxHeightBlock() {
    high=0
    for(let key in this.blocks){
      if(this.blocks.height > high){
        high = this.blocks.height
      }
    }
    for(let key in this.blocks){
      if(this.blocks.height == high){
        return this.blocks[key]
      }
    }
    // return Block
  }

  // 添加区块
  /*
  */
  _addBlock(block) {
    if (!block.isValid()) return
    if (this.containsBlock(block)) return

    // 添加 UTXO 快照与更新的相关逻辑
    // const father = this.blocks[block.fatherHash]
    // if (block.fatherHash == "root"){
    // }else if(father != undefined){
    //   let newUTXOPool = father.utxoPool.clone()
    //   block.utxoPool = newUTXOPool.addUTXO(block.coinbaseBeneficiary, 12.5)
    // }

    if(block.timeStamp == "root"){  //如果区块是root，添加交易
      block.utxoPool.addUTXO("root", 12.5)
      block.coinbaseBeneficiary=12.5
    }else{                          //如果是其他区块，交易是父区快的克隆
      block.utxoPool = block.blockchain.blocks[block.fatherHash].utxoPool.clone()
      if(block.miner != undefined){       //本区块还有交易，再加
        block.utxoPool.addUTXO(block.miner, 12.5)
      }else{
        block.utxoPool.addUTXO(block.blockchain.blocks[block.fatherHash].miner, 12.5)
      }
    }

    this.blocks[block.hash]=block
  }
}

export default Blockchain
