"use strict";

class Superblock{
    static idCounter = 0;

    /**
     * Constructor function for creating a Superblock instance.
     *
     * @param {type} type - The type of the superblock.
     * @param {type} position - The position of the superblock.
     * @param {type} data - The data associated with the superblock.
     * @param {[Block]} children - The children of the superblock.
     */
    constructor(type, position, data, children) {
        this.id = (Superblock.idCounter++).toString() + 's';
        this.type = 'superBlock';
        this.position = position;
        this.data = data;
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