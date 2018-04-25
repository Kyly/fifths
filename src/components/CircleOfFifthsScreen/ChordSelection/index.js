import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Text, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

import { fifths } from '../../../selectors/keys';
import colors from '../../../static/colors';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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
    let seventh;
    if (noFlatOrSharpQuality.includes('°')) {
      // handle diminished chord
      wordQuality = 'Diminished';
      third = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 3) % 12];
      fifth = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 6) % 12];
    } else if (/^[A-Z]+$/g.test(noFlatOrSharpQuality)) {
      // handle major
      wordQuality = 'Major';
      third = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 8) % 12];
      fifth = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 11) % 12];
    } else if (/^[a-z]+$/g.test(noFlatOrSharpQuality)) {
      // handle minor
      wordQuality = 'Minor';
      third = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 3) % 12];
      fifth = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 11) % 12];
    } else {
      // handle dominant
      wordQuality = 'Dominant';
      third = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 8) % 12];
      fifth = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 11) % 12];
      seventh = this.props.fifths[(this.props.fifths.findIndex(el => el === note) + 2) % 12];
    }

    chord.push(third, fifth);
    if (seventh !== undefined) {
      chord.push(seventh);
    }

    this.setState({
      modalNote: note,
      modalQuality: wordQuality,
      modalChord: chord,
    });
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    // setting up array of { note: , quality: }
    const scale = this.props.currentScale === 'maj' ? ['vii°', 'iii', 'vi', 'ii', 'V7', 'I', 'IV'] : ['ii°', 'V7', 'i', 'iv', '♭VII', '♭III', '♭VI'];
    const fifthsIntoScale = this.props.currentScale === 'maj' ? this.props.fifths.filter((el, i) => (i > 0 && i < 8)) : this.props.fifths.filter((el, i) => (i > 3 && i < 11));
    const notesAndQualities = fifthsIntoScale.map((el, i) => ({ note: el, quality: scale[i] }));

    return (
      <View style={{
          alignContent: 'center',
        }}
      >
        <Text>Touch notes below to view chord structures:</Text>
        <ScrollView
          horizontal
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          style={{
            backgroundColor: '#2a2a2a',
          }}
        >
          {
            notesAndQualities.map((el, i) => (
              <TouchableWithoutFeedback
                key={i}
                onPress={() => {
                  this.setChord(el.note, el.quality);
                  this.toggleModal();
                }}
              >
                <View style={{ padding: 10 }}>
                  <Text style={{ color: colors[i + 1] }} >{el.note}</Text>
                  <Text style={{ color: colors[i + 1] }} >{el.quality}</Text>
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
  currentScale: state.keys.scale,
  currentKey: state.keys.currentKey,
});

export default connect(mapStateToProps, null)(ChordSelection);
