'use strict';

class Block {
    static idCounter = 0;
  constructor(type, position, data, parameters) {
    this.id = (Block.idCounter++).toString();
    this.type = type;
    this.position = position;
    this.data = {...data, openInfo: false, isSelected: false};
    this.parameters = parameters;
  }

}



export default Block;
