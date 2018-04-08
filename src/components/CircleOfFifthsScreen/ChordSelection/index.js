import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Text, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

import { fifths } from '../../../selectors/keys';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const colors = [
  '#8cff0a', '#ffff00', '#ffc30a', '#fa870a',
  '#fa500a', '#ff0000', '#8700c3', '#5000c3',
  '#3200a5', '#0000ff', '#0D6485', '#19c80a',
];

class ChordSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalNote: '',
      modalQuality: '',
      modalChord: '',
    };
  }

  setChord = (note, quality) => {
    const chord = [note];
    const noFlatOrSharpQuality = quality.replace(/[♭|♯]/g, '');
    let wordQuality;
    let third;
    let fifth;
    if (noFlatOrSharpQuality.includes('°')) {
      // handle diminished chord
      wordQuality = 'Diminished';
    } else if (/^[A-Z]+$/g.test(noFlatOrSharpQuality)) {
      // handle major
      third = this.props.fifths[this.props.fifths.findIndex(el => el.note === note) - 4 % 12].note;
      fifth = this.props.fifths[this.props.fifths.findIndex(el => el.note === note) - 1 % 12].note;
      chord.push(third, fifth);
      wordQuality = 'Major';
    } else if (/^[a-z]+$/g.test(noFlatOrSharpQuality)) {
      // handle minor
      wordQuality = 'Minor';
    } else {
      // handle dominant
      wordQuality = 'Dominant';
    }

    this.setState({
      modalNote: note,
      modalQuality: wordQuality,
      modalChord: chord,
    });
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    return (
      <View style={{
          backgroundColor: 'whitesmoke',
          alignContent: 'center',
        }}
      >
        <ScrollView
          horizontal
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          style={{
            backgroundColor: '#2a2a2a',
          }}
        >
          {
            this.props.fifths.filter(el => !!el.quality).map((el, i) => (
              <TouchableWithoutFeedback
                key={i}
                onPress={() => {
                  this.setChord(el.note, el.quality);
                  this.toggleModal();
                }}
              >
                <View style={{ padding: 10 }}>
                  <Text style={{ color: colors[i] }} >{el.note}</Text>
                  <Text style={{ color: colors[i] }} >{el.quality}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))
          }
        </ScrollView>
        <Modal
          isVisible={this.state.showModal}
          onSwipe={this.toggleModal}
          swipeDirection="up"
        >
          <View style={{ flex: 0.5, backgroundColor: 'whitesmoke' }}>
            <Text>Chord: {this.state.modalNote} {this.state.modalQuality}</Text>
            <Text>Notes in chord: {this.state.modalChord}</Text>
            <TouchableOpacity onPress={this.toggleModal}>
              <Text>Hide me!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

ChordSelection.propTypes = {
  fifths: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fifths: fifths(state),
});

export default connect(mapStateToProps, null)(ChordSelection);
