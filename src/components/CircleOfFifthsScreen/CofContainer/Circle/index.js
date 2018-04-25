import React, { Component } from 'react';
import { ART } from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setCentroids } from '../../../../actions/art';
// import CircularText from './CircularText';

const {
  Group, Shape,
} = ART;

const d3 = {
  scale,
  shape,
};

class Circle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paths: [],
      data: (new Array(12)).fill({ number: 1 }),
      rotation: 0,
      centroids: [],
      angles: [],
    };
  }

  componentWillMount() {
    this._createChart(this.props.radius);
    // this._setUpGestureHandler();
  }

  _createChart(radius) {
    const arcs = d3.shape.pie()
      .value(item => item.number)(this.state.data);

    const lines = [];
    const centers = [];

    this.setState({
      angles: arcs.map(a => ({ startAngle: a.startAngle, endAngle: a.endAngle })),
    });

    for (let i = 0; i < arcs.length; i++) {
      const path = d3.shape.arc()
        .outerRadius(radius) // Radius of the pie
        .padAngle(0) // Angle between sections
        .innerRadius(this.props.innerRadius)(arcs[i]);


      const center = d3.shape.arc()
        .outerRadius(radius) // Radius of the pie
        .padAngle(0.05) // Angle between sections
        .innerRadius(this.props.innerRadius) // Inner radius: to create a donut or pie
        .centroid(arcs[i]);

      lines.push(path);
      centers.push(center);
    }

    this.setState({ paths: lines });

    this.props.setCentroids(centers);

    // put C to top
    const cIndex = 5;
    const currentStartAngle = arcs[cIndex].startAngle * (180 / Math.PI);
    const currentEndAngle = arcs[cIndex].endAngle * (180 / Math.PI);
    // rotate this note to the top
    this.setState({
      rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle - currentStartAngle) / 2),
    });
  }

  _lockWheel = () => {
    let min = 10;
    let index;
    this.state.angles.forEach((item, i) => {
      if (Math.abs(item.startAngle + this.state.rotation) % 2 * Math.PI < min) {
        min = Math.abs(item.startAngle);
        index = i;
      }
    });
    const currentStartAngle = Math.abs(this.state.rotation + this.state.angles[index].startAngle)
    * (180 / Math.PI);
    const currentEndAngle = Math.abs(this.state.rotation + this.state.angles[index].endAngle)
    * (180 / Math.PI);
    // rotate this note to the top
    this.setState({
      rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle - currentStartAngle) / 2),
    });
  }

  render() {
    return (
      <Group>
        {
          this.state.paths.map((item, index) =>
            (
              <Shape
                key={item}
                fill={this.props.colors[index]}
                stroke={this.props.colors[index]}
                d={item}
              />
            ))
        }
      </Group>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCentroids: centroids => dispatch(setCentroids(centroids)),
});

const mapStateToProps = state => ({
  centroids: state.art.centroids,
});

Circle.propTypes = {
  radius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  setCentroids: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Circle);
