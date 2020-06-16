import {RxDocument, RxCollection, RxJsonSchema} from 'rxdb';
import {v4 as uuid} from 'uuid';
import {DateTime} from 'luxon';

export enum NodeType {
  text = 'text',
  image = 'image',
  file = 'file',
}

type NodeDocType = {
  id: string;
  type: NodeType;
  createdAt: number;
  updatedAt: number;
  authorId: string;
  text?: string;
  name?: string;
  originalUrl?: string;
  localUrl?: string;
  webUrl?: string;
  extension?: string;
};

type NodeDocMethods = {
  getFileIconName: () => string;
  setText: (t: string) => Promise<void>;
};

export type NodeDoc = RxDocument<NodeDocType, NodeDocMethods>;

type NodeCollectionMethods = {
  getAllByLink: (link: string) => Promise<NodeDoc[]>;
  initTextNode: (text: string, authorId: string) => Promise<NodeDoc>;
  initImageNode: (
    name: string,
    localUrl: string,
    originalUrl: string,
    authorId: string,
  ) => Promise<NodeDoc>;
  initFileNode: (
    name: string,
    localUlr: string,
    originalUrl: string,
    extension: string,
    authorId: string,
  ) => Promise<NodeDoc>;
};

export type NodeCollection = RxCollection<
  NodeDocType,
  NodeDocMethods,
  NodeCollectionMethods
>;

let nodeSchema: RxJsonSchema<NodeDocType> = {
  version: 0,
  title: 'node schema',
  description: 'Describes a kipu node',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    type: {
      type: 'string',
    },
    createdAt: {
      type: 'number',
    },
    updatedAt: {
      type: 'number',
    },
    text: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    originalUrl: {
      type: 'string',
    },
    localUrl: {
      type: 'string',
    },
    webUrl: {
      type: 'string',
    },
    extension: {
      type: 'string',
    },
    authorId: {
      type: 'string',
    },
  },
  required: ['type', 'createdAt', 'updatedAt', 'authorId'],
  indexes: ['createdAt'],
};

let nodeDocMethods: NodeDocMethods = {
  getFileIconName: function (this: NodeDoc) {
    return `file`;
  },
  setText: async function (this: NodeDoc, text: string) {
    await this.update({
      $set: {
        text,
      },
    });
  },
};

let nodeCollectionMethods: NodeCollectionMethods = {
  getAllByLink: async function (this: NodeCollection, link: string) {
    console.warn('should filter by link', link);
    return [];
  },
  initTextNode: async function (
    this: NodeCollection,
    text: string,
    authorId: string,
  ) {
    let nowMillis = DateTime.local().toMillis();
    return await this.insert({
      id: uuid(),
      type: NodeType.text,
      createdAt: nowMillis,
      updatedAt: nowMillis,
      text,
      authorId,
    });
  },
  initImageNode: async function (
    this: NodeCollection,
    name: string,
    localUrl: string,
    originalUrl: string,
    authorId: string,
  ) {
    let nowMillis = DateTime.local().toMillis();
    return await this.insert({
      id: uuid(),
      type: NodeType.image,
      createdAt: nowMillis,
      updatedAt: nowMillis,
      name,
      localUrl,
      originalUrl,
      authorId,
    });
  },
  initFileNode: async function (
    this: NodeCollection,
    name: string,
    localUrl: string,
    originalUrl: string,
    extension: string,
    authorId: string,
  ) {
    let nowMillis = DateTime.local().toMillis();
    return await this.insert({
      id: uuid(),
      type: NodeType.file,
      createdAt: nowMillis,
      updatedAt: nowMillis,
      name,
      localUrl,
      originalUrl,
      extension,
      authorId,
    });
  },
};

export let nodeCollectionSchema = {
  name: 'nodes',
  schema: nodeSchema,
  methods: nodeDocMethods,
  statics: nodeCollectionMethods,
};
