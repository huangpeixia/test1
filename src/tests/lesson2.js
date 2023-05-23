import Block, { DIFFICULTY } from '../models/Block.js'
import Blockchain from '../models/Blockchain.js'
import sha256 from 'crypto-js/sha256.js'
import { calcNonce } from '../utils.js'

const main = () => {
  // 初始化区块链
  let blockchain = new Blockchain('BitCoin')

  // 创建创世区块
  let genesisBlock = new Block(blockchain, 'root', 0, 'root')

  // 设置创世区块
  blockchain.genesis = genesisBlock

  // 验证区块难度
  console.assert(DIFFICULTY > 0, 'Error: Need config DIFFICULTY on Block file')

  // 构建区块
  let newBlock = new Block(
    blockchain,
    genesisBlock.hash,
    1,
    sha256(new Date().getTime().toString()).toString(),
  )

  // 验证区块难度合法性
  console.assert(newBlock.isValid() == false, 'Error: Very low probability')

  newBlock = calcNonce(newBlock)
  //console.log(newBlock.hash)

  console.assert(newBlock.isValid() == true, 'Error: Very low probability')

  blockchain.blocks[newBlock.hash] = newBlock

  let nextBlock = new Block(
    blockchain,
    newBlock.hash,
    2,
    sha256(new Date().getTime().toString()).toString(),
  )

  let nextCompetitionBlock = new Block(
    blockchain,
    newBlock.hash,
    2,
    sha256((new Date().getTime() + 1).toString()).toString(),
  )

  nextBlock = calcNonce(nextBlock)
  //console.log(nextBlock.hash)
  nextCompetitionBlock = calcNonce(nextCompetitionBlock)
  //console.log(nextCompetitionBlock.hash)
  // 添加两个区块高度为 2  的的竞争区块
  blockchain.blocks[nextBlock.hash] = nextBlock
  blockchain.blocks[nextCompetitionBlock.hash] = nextCompetitionBlock

  let longestChain = blockchain.longestChain(genesisBlock)

  console.assert(longestChain.length == 2, 'Error: Block height should be 2')

  let thirdBlock = new Block(
    blockchain,
    nextCompetitionBlock.hash,
    3,
    sha256(new Date().getTime().toString()).toString(),
  )

  thirdBlock = calcNonce(thirdBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[thirdBlock.hash] = thirdBlock

  longestChain = blockchain.longestChain(genesisBlock)

  // 区块检查
  console.assert(longestChain.length == 3, 'Block height should be 3')
  console.assert(
    longestChain[2].hash == thirdBlock.hash,
    `Height block hash should be ${thirdBlock.hash}`,
  )
  let fourthBlock = new Block(
    blockchain,
    thirdBlock.hash,
    4,
    sha256(new Date().getTime().toString()).toString(),
  )

  fourthBlock = calcNonce(fourthBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[fourthBlock.hash] = fourthBlock
  let fifthBlock = new Block(
    blockchain,
    fourthBlock.hash,
    5,
    sha256(new Date().getTime().toString()).toString(),
  )

  fifthBlock = calcNonce(fifthBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[fifthBlock.hash] = fifthBlock
  let sixthBlock = new Block(
    blockchain,
    fifthBlock.hash,
    6,
    sha256(new Date().getTime().toString()).toString(),
  )

  sixthBlock = calcNonce(sixthBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[sixthBlock.hash] = sixthBlock
  let seventhBlock = new Block(
    blockchain,
    sixthBlock.hash,
    7,
    sha256(new Date().getTime().toString()).toString(),
  )

  seventhBlock = calcNonce(seventhBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[seventhBlock.hash] = seventhBlock
  let eighthBlock = new Block(
    blockchain,
    seventhBlock.hash,
    8,
    sha256(new Date().getTime().toString()).toString(),
  )

  eighthBlock = calcNonce(eighthBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[eighthBlock.hash] = eighthBlock
  let ninthBlock = new Block(
    blockchain,
    eighthBlock.hash,
    9,
    sha256(new Date().getTime().toString()).toString(),
  )

  ninthBlock = calcNonce(ninthBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[ninthBlock.hash] = ninthBlock
  let tenthBlock = new Block(
    blockchain,
    ninthBlock.hash,
    10,
    sha256(new Date().getTime().toString()).toString(),
  )

  tenthBlock = calcNonce(tenthBlock)
  //console.log(thirdBlock.hash)
  blockchain.blocks[tenthBlock.hash] = tenthBlock
}

main()
