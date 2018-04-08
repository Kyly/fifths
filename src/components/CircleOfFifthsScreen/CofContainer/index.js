import React, { Component } from 'react';
import {
  ART,
  StyleSheet,
  View,
  Dimensions,
  PanResponder,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getKeyObject, fifths, rotation } from '../../../selectors/keys';
import rotateMappings from '../../../static/rotationMappings';
import { changeKey } from '../../../actions/keys';
import _distanceBetweenTwoPoints from '../../../util/geometry';
import Circle from './Circle';
import CircularText from './CircularText';

const {
  Surface,
  Group,
  Transform,
  Text,
} = ART;

// const art = Platform.select({
//   ios: (
//     <View>
//       <Circle
//         radius={150}
//         colors={[
//           '#fa500a', '#ff0000', '#8700c3', '#5000c3',
//           '#3200a5', '#0000ff', '#2dc3be', '#19c80a',
//           '#8cff0a', '#ffff00', '#ffc30a', '#fa870a',
//         ]}
//       />
//       <Circle
//         radius={200}
//         colors={[
//           '#8cff0a', '#ffff00', '#ffc30a', '#fa870a',
//           '#fa500a', '#ff0000', '#8700c3', '#5000c3',
//           '#3200a5', '#0000ff', '#2dc3be', '#19c80a',
//         ]}
//       />
//     </View>
//   ),
//   android: <CircleOfFifths />,
// });

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'whitesmoke',
    marginTop: 21,
    alignItems: 'center',
  },
});

const colors = [
  '#8cff0a', '#ffff00', '#ffc30a', '#fa870a',
  '#fa500a', '#ff0000', '#8700c3', '#5000c3',
  '#3200a5', '#0000ff', '#0D6485', '#19c80a',
];

class CofContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTouch: {},
      lastTouch: {},
      // brings c to top
      rotation: 195,
    };

    // set up rotation of circle
    this._setUpGestureHandler();
    this._lockWheel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rotation !== this.state.rotation) {
      this.setState({ rotation: nextProps.rotation });
    }
  }

  _lockWheel() {
    const rotationCurrent = (this.state.rotation % 360 + 360) % 360;
    console.log(rotationCurrent);
    // get closest rotate value
    let curr = rotateMappings[0];
    for (let i = 0; i < rotateMappings.length; i++) {
      if (Math.abs(rotationCurrent - rotateMappings[i]) < Math.abs(rotationCurrent - curr)) {
        curr = rotateMappings[i];
      }
    }
    const index = rotateMappings.indexOf(curr);
    const newRoot = this.props.fifths.map(el => el.note)[index];
    console.log('NEW ROOT', newRoot);
    this.props.changeKey(newRoot);
  }

  _setUpGestureHandler() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        this.setState({ lastTouch: {}, currentTouch: {} });
      },
      onPanResponderRelease: () => {
        this._lockWheel();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          if (this.state.lastTouch === {}) {
            this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });
            this.setState({ lastTouch: { X: 0, Y: 0 } });
          } else {
            this.setState({ lastTouch: this.state.currentTouch });
            this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });
            console.log('WINDOW DIMENSIONS');
            console.log(Dimensions.get('window').width / 2);
            console.log(Dimensions.get('window').height * (3 / 4));
            const triangle = {
              // magic numbers
              radiusPoint: {
                X: Dimensions.get('window').width / 2,
                Y: Dimensions.get('window').height * (3 / 4),
              },
              lastPoint: this.state.lastTouch,
              currentPoint: this.state.currentTouch,

              a: {},
              b: {},
              c: {},

              theta: {},
            };

            // find angle with law of cosines
            triangle.a =
              _distanceBetweenTwoPoints(triangle.lastPoint, triangle.currentPoint);
            triangle.b =
              _distanceBetweenTwoPoints(triangle.radiusPoint, triangle.lastPoint);
            triangle.c =
              _distanceBetweenTwoPoints(triangle.radiusPoint, triangle.currentPoint);

            triangle.theta =
              Math.acos((-(triangle.a ** 2) + (triangle.b ** 2) + (triangle.c ** 2)) / (2 * triangle.b * triangle.c)) * (180 / Math.PI);

            // TODO fix the if statements below;
            // gross if statements for actual rotation
            if (triangle.currentPoint.Y > triangle.radiusPoint.Y
              && triangle.currentPoint.X > triangle.lastPoint.X
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation - triangle.theta) % 360 });
            } else if (triangle.currentPoint.Y > triangle.radiusPoint.Y
              && triangle.currentPoint.X < triangle.lastPoint.X
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation + triangle.theta) % 360 });
            } else if (triangle.currentPoint.Y < triangle.radiusPoint.Y
              && triangle.currentPoint.X > triangle.lastPoint.X
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation + triangle.theta) % 360 });
            } else if (triangle.currentPoint.Y < triangle.radiusPoint.Y
              && triangle.currentPoint.X < triangle.lastPoint.X
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation - triangle.theta) % 360 });
            } else if (triangle.currentPoint.X < triangle.radiusPoint.X
              && triangle.currentPoint.Y < triangle.lastPoint.Y
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation + triangle.theta) % 360 });
            } else if (triangle.currentPoint.X < triangle.radiusPoint.X
              && triangle.currentPoint.Y > triangle.lastPoint.Y
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation - triangle.theta) % 360 });
            } else if (triangle.currentPoint.X > triangle.radiusPoint.X
              && triangle.currentPoint.Y < triangle.lastPoint.Y
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation - triangle.theta) % 360 });
            } else if (triangle.currentPoint.X > triangle.radiusPoint.X
              && triangle.currentPoint.Y > triangle.lastPoint.Y
              && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
            ) {
              this.setState({ rotation: (this.state.rotation + triangle.theta) % 360 });
            }
          }
        }
      },
    });
  }

  render() {
    const x = Dimensions.get('window').width / 2;
    const y = Dimensions.get('window').height / 4;
    const radius = x * 2 < Dimensions.get('window').height / 2 ? x : y;
    return (
      <View style={styles.container}>
        <View {...this._panResponder.panHandlers}>
          <Surface width={Dimensions.get('window').width} height={Dimensions.get('window').height}>
            <Group x={x} y={y}>
              <Text
                x={0}
                y={-y / 2}
                alignment="middle"
                fill="#000"
                font='bold 12px "Arial"'
              >
                V
              </Text>
            </Group>
            <Group x={x} y={y} transform={new Transform().rotate(this.state.rotation)}>
              <Circle
                radius={radius}
                innerRadius={radius / 10}
                colors={colors}
              />
              <Circle
                radius={radius * (14 / 18)}
                innerRadius={radius * (14 / 18) - 5}
                colors={new Array(12).fill('#000')}
              />
              <Circle
                radius={radius / 2}
                innerRadius={radius / 2 - 5}
                colors={new Array(12).fill('#000')}
              />
              { /* Circular text for current key */}
              <CircularText
                data={this.props.fifths.map((el) => {
                  if (!el.quality) {
                    return '';
                  }
                  return el.quality;
                })}
                rotation={-this.state.rotation}
                colors={new Array(12).fill('#000')}
                multiplier={1.45}
              />
              { /* Circular text for all notes */}
              <CircularText
                data={this.props.fifths.map(el => el.note)}
                rotation={-this.state.rotation}
                colors={new Array(12).fill('#000')}
                multiplier={1.25}
              />
              { /* Circular text for parallel notes */}
              {this.props.showParallel ?
                <CircularText
                  data={this.props.fifths.map((el) => {
                    if (!el.parallel) {
                      return '';
                    }
                    return el.parallel;
                  })}
                  rotation={-this.state.rotation}
                  colors={new Array(12).fill('#000')}
                  multiplier={0.6}
                /> : null
              }
              { /* Circular text for relative notes */}
              {this.props.showRelative ?
                <CircularText
                  data={this.props.fifths.map((el) => {
                    if (!el.relative) {
                      return '';
                    }
                    return el.relative;
                  })}
                  rotation={-this.state.rotation}
                  colors={new Array(12).fill('#000')}
                  multiplier={1.85}
                /> : null
              }
            </Group>
          </Surface>
        </View>
      </View>
    );
  }
}

CofContainer.propTypes = {
  keyObject: PropTypes.arrayOf(PropTypes.object).isRequired,
  fifths: PropTypes.arrayOf(PropTypes.object).isRequired,
  rotation: PropTypes.number.isRequired,
  changeKey: PropTypes.func.isRequired,
  showParallel: PropTypes.bool.isRequired,
  showRelative: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  keyObject: getKeyObject(state),
  fifths: fifths(state),
  rotation: rotation(state),
  currentKey: state.keys.currentKey,
  showParallel: state.keys.showParallel,
  showRelative: state.keys.showRelative,
});

const mapDispatchToProps = dispatch => ({
  changeKey: newKey => dispatch(changeKey(newKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CofContainer);
