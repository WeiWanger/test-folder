class Folder {
  constructor(id, parent, text, droppable) {
    (this.id = id),
      (this.parent = parent),
      (this.text = text),
      (this.droppable = droppable);
  }
}

module.exports = Folder;
