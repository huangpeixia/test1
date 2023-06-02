import sha256 from 'crypto-js/sha256.js'

class MerkleTree {
    constructor(transactions) {
      this.transactions = transactions;
      this.tree = [];
  
      // 计算所有数据的哈希值
      this.hashTransactions = this.transactions.map(transaction => this.hash(transaction));
  
      // 初始化默克尔树
      this.buildTree();
    }
  
    // 计算哈希值
    hash(data) {
      return sha256(data).toString();
    }
  
    // 构建默克尔树
    buildTree() {
      let level = this.hashTransactions;
      while (level.length > 1) {
        const treeLevel = [];
        for (let i = 0; i < level.length; i += 2) {
          let left = level[i];
          let right = i + 1 < level.length ? level[i + 1] : '';
          treeLevel.push(this.hash(left + right));
        }
        level = treeLevel;
      }
      this.tree = level;
    }
  
    // 获取 Merkle 树根哈希
    getRoot() {
      return this.tree[0];
    }
  
    // 验证数据在 Merkle 树中
    verify(data) {
      const hash = this.hash(data);
      let found = false;
  
      for (let i = 0; i < this.transactions.length && !found; i++) {
        if (this.hashTransactions[i] === hash) {
          found = true;
        }
      }
  
      if (!found) {
        return false;
      }
  
      let index = this.hashTransactions.indexOf(hash);
      let proofIndex = 0;
      let proof = this.tree.slice();
  
      while (proof.length > 1) {
        const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
        const pair = proof[pairIndex];
  
        proofIndex += pairIndex < index ? this.hash(pair + proof[index]) : this.hash(proof[index] + pair);
        index = Math.floor(index / 2);
      }
  
      return proofIndex === this.tree[0];
    }
}
