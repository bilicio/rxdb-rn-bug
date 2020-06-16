import React, {useState, useEffect} from 'react';
import {createDatabase, KipuDatabase} from './database';
import {NodeDoc, NodeType} from './schema';
import {DateTime} from 'luxon';
import {v4 as uuid} from 'uuid';
import {TouchableOpacity, View, Text} from 'react-native';

function App() {
  let [db, setDb] = useState<KipuDatabase>();
  let [nodes, setNodes] = useState<NodeDoc[]>([]);
  let [selectedNode, setSelectedNode] = useState<NodeDoc>();

  useEffect(() => {
    createDatabase('test').then((db) => {
      setDb(db);

      db.nodes
        .find()
        .sort({createdAt: 'desc'})
        .$.subscribe((dbNodes) => {
          if (dbNodes) {
            setNodes(dbNodes);
          }
        });
    });
  }, []);

  if (!db) {
    return null;
  }

  function addRandomNode() {
    db?.nodes.insert({
      id: uuid(),
      createdAt: DateTime.utc().toMillis(),
      updatedAt: DateTime.utc().toMillis(),
      type: NodeType.text,
      authorId: 'HARDCODED AUTHOR',
    });
  }

  function selectNode(id: string) {
    db?.nodes
      .findOne()
      .where('id')
      .eq(id)
      .exec()
      .then((node) => {
        if (node) {
          setSelectedNode(node);
        }
      });
  }

  function randomlyUpdate() {
    if (selectedNode) {
      selectedNode.atomicSet('text', `${Math.random()}`);
    }
  }

  return (
    <View style={{paddingTop: 80}}>
      {nodes.map((n) => {
        return (
          <TouchableOpacity onPress={() => selectNode(n.id)}>
            <Text>{n.id}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={addRandomNode}>
        <Text>Add random node</Text>
      </TouchableOpacity>
      <Text>
        Selected node: {selectedNode?.id}, text: {selectedNode?.text}
      </Text>
      <TouchableOpacity onPress={randomlyUpdate}>
        <Text>Randomly update selected node</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;
