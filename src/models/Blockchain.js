// Blockchain
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
}

export default Blockchain
