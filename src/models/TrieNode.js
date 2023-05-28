class TrieNode {
    constructor() {
      this.children = new Map(); 
      this.end = false;    // 每个节点默认不是结束点
    }
  
    insert(word) {
      let current = this;
      for (const char of word) {
        if (!current.children.has(char)) {
          current.children.set(char, new TrieNode());
        }
        current = current.children.get(char); // 切换到子节点进行下一次循环
      }
      current.end = true; // 单词结束时，将当前节点标记为单词结束点
      current.children.set(-1, new TrieNode()); // 添加一个特殊标记表示结束
    }
  
    remove(word) {
      const stack = [];
      let current = this;
      for (const char of word) {
        if (!current.children.has(char)) {
          return;
        }
        stack.push(current);
        current = current.children.get(char);
      }
      if (!current.end) {
        return;
      }
      current.end = false; // 将单词结束点置为false，对应的子节点将被删除
      current.children.delete(-1); // 删除特殊标记表示结束
      if (current.children.size === 0 && stack.length > 0) {
        // 如果当前节点没有其他子节点，删除自己，并重新建立父节点和子节点之间的链接
        current = stack.pop();
        current.children.delete(word[word.length - 1]);
        this.connectParentToChild(current, word.slice(0, word.length - 1), stack);
      }
      while (stack.length > 0 && current.children.size === 0) {
        // 继续沿着栈向上追溯，删除所有不再关联任何单词的节点
        current = stack.pop();
        current.children.delete(word[word.length - 1]);
      }
    }
  
    // 将父节点与子节点之间的链接进行重新建立
    connectParentToChild(parent, prefix, stack) {
      if (stack.length > 0 && parent.children.size === 0) {
        // 如果父节点没有其他子节点，删除自己，并重新建立祖先节点和子节点之间的链接
        const grandParent = stack.pop();
        grandParent.children.delete(prefix[prefix.length - 1]);
        this.connectParentToChild(grandParent, prefix.slice(0, prefix.length - 1), stack);
      } else if (stack.length > 0) {
        // 否则，建立父节点和子节点之间的链接
        const child = parent.children.get(prefix[prefix.length - 1]);
        stack[stack.length - 1].children.set(prefix[prefix.length - 1], child);
      }
    }
  }