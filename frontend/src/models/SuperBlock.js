"use strict";

class Superblock{
    static idCounter = 0;

    /**
     * Constructor function for creating a Superblock instance.
     *
     * @param {String} type - The type of the superblock.
     * @param {Object} position - The position of the superblock.
     * @param {Object} data - The data associated with the superblock.
     * @param {[String]} children - The list of the children ids.
     */
    constructor(type, position, data, children) {
        this.id = (Superblock.idCounter++).toString() + 's';
        this.type = type;
        this.position = position;
        this.data = { ...data, openInfo: false, isSelected: false, isOpenInSheet: false };
        this.children = children;
    }

    /**
     * Adds a child to the list of children.
     *
     * @param {Block} child - The child to be added.
     */
    addChild(child) {
        this.children.push(child);
    }
}

export default Superblock;
