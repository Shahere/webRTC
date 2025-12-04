class Contact {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.name = name;
    this.id = id;
  }

  toString() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export { Contact };
