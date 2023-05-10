class Block {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含

  */
  constructor(blockchain,fatherHash,height,hash) {
    this.blockchain=blockchain
    this.fatherHash=fatherHash  //父区块的哈希值
    this.height=height
    this.hash=hash
  }
}

export default Block
