import React, { Component } from 'react';
import { FlatList, StyleSheet, Image, ScrollView, View, Text } from 'react-native';

import styles from './styles';

export default class CircleOfFifthsReference extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        { /* Title */ }
        <Text style={styles.title}>The Circle of Fifths</Text>
        <Text style={styles.paragraph}>
          Musical Gravity can be portrayed in the following sequence of Perfect Fifths:
        </Text>
        <ScrollView style={styles.horizontalScroll} horizontal>
          <Text>B# -> E# -> A# -> D# -> G# -> C# -> F# -> B -> E -> A -> D -> G -> C -> F -> Bb -> Eb -> Ab -> Db -> Gb -> Cb -> Fb etc...</Text>
        </ ScrollView>
        <Text style={styles.paragraph}>
          Of course, the above sequence includes many enharmonic equivalents (two notes that sound the same but are spelled differently, eg C# and Db), and is therefore needlessly complex. It can be portrayed much more simply as follows:
        </Text>
        {/* Image */ }

        <Text style={styles.paragraph}>
          This diagram, read clockwise, shows the natural flow of notes in an endless sequence of Perfect Fifths, and is called “The Circle of Fifths.” It shows all 12 pitches used in modern tonal music, in their proper relationship to each other, as well as the natural flow of musical gravity. 
          Importantly, this musical gravity also works with chords, and not just with individual notes. A chord built on G will “want” to move to a chord built on C; a chord built on Eb will want to move to a chord built on Ab. This principle is the foundation of how chords move from one to another.  
          <Text style={{ fontStyle: 'italic' }}>
            C placed at the top of the circle because the key of C Major contains no sharps or flats. The 7 notes in these keys are BEADGCF.
          </Text>
        </Text>
        { /* List Example */ }
        <FlatList
          data={[{key: 'a'}, {key: 'b'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      </ ScrollView>
    );
  }
};

