import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-modest-checkbox';

import { changeScale, toggleParallel, toggleRelative } from '../../../actions/keys';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
});

const majorMinorLabel = scale => (
  <Text>
    <Text style={scale === 'maj' ? { color: 'red' } : {}}>Major</Text>
     /
    <Text style={scale === 'min' ? { color: 'red' } : {}}>Minor</Text>
  </Text>
);

class Toggles extends Component {
  constructor(props) {
    super(props);
    this.state = { isMajor: true };
  }

  toggle = (value) => {
    const newScale = this.props.currentScale === 'maj' ? 'min' : 'maj';
    this.props.changeScale(newScale);
    this.setState({ isMajor: value });
  };

  render() {
    return (
      <View style={styles.container}>
        <CheckBox
          label="Show Parallel"
          labelBefore
          onChange={checked => this.props.toggleParallel(checked.checked)}
          checked={this.props.showParallel}
        />
        <CheckBox
          label="Show Relative"
          labelBefore
          onChange={checked => this.props.toggleRelative(checked.checked)}
          checked={this.props.showRelative}
        />
        <CheckBox
          label={majorMinorLabel(this.props.currentScale)}
          labelBefore
          onChange={checked => this.toggle(checked.checked)}
          checked={this.state.isMajor}
        />
      </View>
    );
  }
}

Toggles.propTypes = {
  currentScale: PropTypes.string.isRequired,
  changeScale: PropTypes.func.isRequired,
  showParallel: PropTypes.bool.isRequired,
  showRelative: PropTypes.bool.isRequired,
  toggleParallel: PropTypes.func.isRequired,
  toggleRelative: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentScale: state.keys.scale,
  showParallel: state.keys.showParallel,
  showRelative: state.keys.showRelative,
});

const mapDispatchToProps = dispatch => ({
  changeScale: newScale => dispatch(changeScale(newScale)),
  toggleParallel: shouldShow => dispatch(toggleParallel(shouldShow)),
  toggleRelative: shouldShow => dispatch(toggleRelative(shouldShow)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toggles);
