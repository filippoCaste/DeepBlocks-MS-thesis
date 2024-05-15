'use strict';

class Block {
    static idCounter = 3;
  constructor(type, position, data) {
    this.id = (Block.idCounter++).toString();
    this.type = type;
    this.position = position;
    this.data = {...data, openInfo: false, isSelected: false};
  }

}



export default Block;
