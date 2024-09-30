'use strict';

class Block {
    static idCounter = 0;
  constructor(type, position, data, parameters, fn, description) {
    this.id = (Block.idCounter++).toString();
    this.type = type;
    this.position = position;
    this.data = {...data, openInfo: false, isSelected: false};
    this.parameters = parameters;
    this.hidden = false;
    this.fn = fn;
    this.description = description;
  }

  static updateIdCounter(newIdCounter) {
    Block.idCounter = newIdCounter;
  }

}



export default Block;
