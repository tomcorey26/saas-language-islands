declare module "genanki-js" {
  export class Model {
    constructor(options: {
      id: number;
      name: string;
      fields: { name: string }[];
      templates: {
        name: string;
        qfmt: string;
        afmt: string;
      }[];
      css?: string;
    });
  }

  export class Note {
    constructor(
      model: Model,
      options: {
        fields: string[];
        tags?: string[];
      }
    );
  }

  export class Deck {
    constructor(id: number, name: string);
    addNote(note: Note): void;
  }

  export class Package {
    constructor(deck: Deck);
    writeToArrayBuffer(): Promise<ArrayBuffer>;
  }
}