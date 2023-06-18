import sha256 from 'crypto-js/sha256.js'


class Transaction {
  constructor(minePubKey, receiverPubKey, money, fee) {
    this.minePubKey=minePubKey           //我，发送方
    this.receiverPubKey=receiverPubKey   //别人，接收方
    this.money=money                     //交易金额
    this.fee=fee
    this.hash=this._calculateHash()
  }

  // 更新交易 hash
  _setHash() {
    this.hash=this._calculateHash()
  }

  // 计算交易 hash 的摘要函数
  _calculateHash() {
   return sha256(this.minePubKey+this.receiverPubKey+this.money+this.fee).toString()
  }
}

export default Transaction