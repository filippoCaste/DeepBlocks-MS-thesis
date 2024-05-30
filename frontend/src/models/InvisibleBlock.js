'use strict';

class InvisibleBlock {
  constructor(id, type, position) {
    this.id = id;
    this.type = type;
    this.position = position;
    this.hidden = true;
    this.data = {label: ''};
  }

}



export default InvisibleBlock;
