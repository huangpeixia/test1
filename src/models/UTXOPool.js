import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {  //对应：UTXO：amount
    this.utxos=utxos
  }

  // 添加交易函数
  /**
   * 将交易的信息更新至 UTXOPool 中
   */
  addUTXO(publicKey, amount) {
    if (this.utxos[publicKey]){  //如果已经存在，交易叠加
      this.utxos[publicKey].amount += amount
    }else{
      const u = new UTXO(amount)
      this.utxos[publicKey] = u
    }
  }

  // 将当前 UXTO 的副本克隆
  clone() {
    return new UTXOPool(this.utxos)
  }

    // 处理交易函数
  handleTransaction(trx){  //处理交易，更新余额
    let i = 0
    let num1 = 0
    let num2 = 0
    for(let key in this.utxos){
      if(key == trx.minePubKey && this.utxos[key].amount < trx.money+trx.fee){
        break
      }

      if (key == trx.minePubKey){
        num1 = this.utxos[key].amount
        this.utxos[key].amount -= (trx.money+trx.fee)
        num2 = this.utxos[key].amount
      }else if (key == trx.receiverPubKey){
        i++
        this.utxos[key].amount += (trx.money+trx.fee)
      }
    }

    if(i == 0 && num1 != num2){
      const u = new UTXO(trx.money+trx.fee)    
      this.utxos[trx.receiverPubKey] = u
    }
  }

  // 验证交易合法性
  /**
   * 验证余额
   * 返回 bool 
   */
  isValidTransaction(trx){   //检验有没有那么多钱来发
    for(let key in this.utxos){
      if (key == trx.minePubKey && this.utxos[key].amount >= (trx.money+trx.fee)){
        return true
      }
    }
    return false
  }
}

export default UTXOPool