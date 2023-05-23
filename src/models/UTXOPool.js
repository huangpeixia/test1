import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {  //对应：UTXO：amount
    this.utxos=utxos
  }

  // 添加交易函数
  /**
   * 将交易的信息更新至 UTXOPool 中
   */
  addUTXO(miner, amount) {
    if (this.utxos[miner]){  //如果已经存在，交易叠加
      this.utxos[miner].amount += amount
    }else{
      const u = new UTXO(amount)
      this.utxos[miner] = u
    }
  }

  // 将当前 UXTO 的副本克隆
  clone() {
    return new UTXOPool(this.utxos)
  }
}

export default UTXOPool