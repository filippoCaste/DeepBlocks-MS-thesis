'use strict';

class Block {
    static idCounter = 3;
  constructor(type, position, data) {
    this.id = (Block.idCounter++).toString();
    this.type = type;
    this.position = position;
    this.data = data;
  }

}



export default Block;
