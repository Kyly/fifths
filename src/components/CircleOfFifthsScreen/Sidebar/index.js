import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableWithoutFeedback, View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { tonalGravity } from '../../../static/keySignatures';
import { changeKey } from '../../../actions/keys';
import { getKeyObject } from '../../../selectors/keys';

const windowHeight = Dimensions.get('window').height;
const colors = [
  '#8cff0a', '#ffff00', '#ffc30a', '#fa870a',
  '#fa500a', '#ff0000', '#8700c3', '#5000c3',
  '#3200a5', '#0000ff', '#0D6485', '#19c80a',
];

const TouchableNote = (note, changeKeyFunc, color) => (
  <TouchableWithoutFeedback key={note} onPress={() => changeKeyFunc(note)}>
    <View style={{ padding: 15 }}>
      <Text style={{ color }} >
        {note}
      </Text>
    </View>
  </TouchableWithoutFeedback>
);

const Sidebar = (props) => {
  let startIndex = tonalGravity.findIndex(el => el.note === props.currentKey);
  startIndex -= props.currentScale === 'maj' ? 5 : 2;
  const endIndex = startIndex + 6;
  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      style={
      {
        top: windowHeight / 20,
        backgroundColor: 'whitesmoke',
      }}
    >
      {tonalGravity.filter((el, i) => (i < startIndex)).map(el => TouchableNote(el.note, props.changeKey))}
      <View style={{ backgroundColor: '#2a2a2a' }}>
        {tonalGravity.filter((el, i) => (i >= startIndex && i <= endIndex)).map((el, i) => TouchableNote(el.note, props.changeKey, colors[i]))}
      </View>
      {tonalGravity.filter((el, i) => (i > endIndex)).map(el => TouchableNote(el.note, props.changeKey))}
    </ScrollView>
  );
};

Sidebar.propTypes = {
  keyObject: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeKey: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentKey: state.keys.currentKey,
  currentScale: state.keys.scale,
});

const mapDispatchToProps = dispatch => ({
  changeKey: newKey => dispatch(changeKey(newKey)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
