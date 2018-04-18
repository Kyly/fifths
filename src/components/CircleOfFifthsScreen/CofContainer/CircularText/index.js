import React from 'react';
import PropTypes from 'prop-types';
import { ART, Text as NormText, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

const {
  Group, Transform, Text,
} = ART;

const CircularText = props => (
  <Group>
    {
      props.data.map((item, index) =>
        (<Text
          key={index}
          x={props.centroids[index][0] * props.multiplier}
          y={props.centroids[index][1] * props.multiplier}
          alignment="middle"
          fill={props.colors[index]}
          font='bold 10px "Helvetica"'
          transform={new Transform().rotate(props.rotation)}
        >
          {item}
        </Text>
      ))
    }
  </Group>

);

CircularText.propTypes = {
  data: PropTypes.array.isRequired,
  centroids: PropTypes.array.isRequired,
  rotation: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  multiplier: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  centroids: state.art.centroids,
});

export default connect(mapStateToProps)(CircularText);

