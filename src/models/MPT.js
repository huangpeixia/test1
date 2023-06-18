import keccak256 from 'crypto-js/keccak256'

class MPTNode {
  constructor(flag, value) {
    this.flag = flag;
    this.value = value;
    this.childNodes = {};
  }
}

class MPT {
  constructor() {
    this.root = new MPTNode(0, '');
  }

  // 哈希值计算
  hash(data) {
    return keccak256(data);
  }

  // 十六进制字符串转换为数组
  hexToArray(hexStr) {
    const byteArray = [];
    for (let i = 2; i < hexStr.length; i += 2) {
      byteArray.push(parseInt(hexStr.substr(i, 2), 16));
    }
    return byteArray;
  }

  // 账户地址转换为 MPT 路径
  addressToPath(address) {
    const padding = Buffer.alloc(32 - address.length / 2).fill(0);
    const hash = this.hash(Buffer.concat([padding, this.hexToArray(address)]));
    const path = hash.toString('hex').match(/.{1,2}/g).join('');
    return path;
  }

  // 获取 MPT 对应地址的值
  get(address) {
    // 将地址转换为 MPT 路径
    const path = this.addressToPath(address);
    let node = this.root;
    let i = 0;
    while (i < path.length) {
      const hexValue = path.substr(i, 2);
      const byteValue = parseInt(hexValue, 16);
      if (!(byteValue in node.childNodes)) {
        return undefined;
      }
      node = node.childNodes[byteValue];
      i += 2;
    }
    if (node.flag === 2) {
      return node.value;
    } else {
      return undefined;
    }
  }

  // 设置 MPT 对应地址的值
  set(address, value) {
    // 将地址转换为 MPT 路径
    const path = this.addressToPath(address);
    let node = this.root;
    let i = 0;
    while (i < path.length) {
      const hexValue = path.substr(i, 2);
      const byteValue = parseInt(hexValue, 16);
      if (!(byteValue in node.childNodes)) {
        node.childNodes[byteValue] = new MPTNode(2, '');
      }
      node = node.childNodes[byteValue];
      i += 2;
    }
    node.flag = 2;
    node.value = value;
  }

  // 计算 MPT 树的根哈希
  getRoot() {
    const hash = this.hash(this.encodeNode(this.root));
    return hash.toString('hex').match(/.{1,2}/g).join('');
  }

  // 编码 MPT 节点
  encodeNode(node) {
    let header;
    let data;

    if (node.flag === 0) {
      return '';
    }

    if (node.flag === 1) {
      header = '01';
      data = Buffer.alloc(1).fill(node.value);
    }

    if (node.flag === 2) {
      header = '02';
      const valueLen = node.value.length / 2;
      const nibbleLen = valueLen * 2 + 1;
      const byteLen = (nibbleLen + 1) / 2;
      const totalLen = byteLen + 1;
      const prefix = (valueLen % 2) ? '1' : '0';
      data = Buffer.alloc(totalLen).fill(0);
      data[0] = prefix;
      for (let i = 0; i < nibbleLen; i += 2) {
        const nibble = parseInt(node.value.substr(i, 2), 16);
        const shift = 4 - (i % 2) * 4;
        data[1 + (i + 1) / 2 - 1] |= nibble << shift;
      }
    }

    const children = [];
    for (let key in node.childNodes) {
      children[key] = node.childNodes[key];
    }

    const childData = [];
    for (let i = 0; i < 16; i++) {
      if (i in children) {
        childData[i] = this.encodeNode(children[i]);
      } else {
        childData[i] = '';
      }
    }

    data = Buffer.concat([Buffer.from(header, 'hex'), data, ...childData.map(x => Buffer.from(x, 'hex'))]);

    return data;
  }
}