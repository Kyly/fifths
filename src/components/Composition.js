import { default as React, Component } from 'react';
import { Button, Platform, StyleSheet, Switch, Text, View, } from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons';
import component from 'create-react-class';

// f(component, props, childElements) => element
const e = function(component, props, children) {
    props = props || {};
    children = children || [];
    return React.createElement(component, props, ...children);
};
// f(methods) => component

// f(text, props) => element
const eText = function(text, props) {
    props = props || {};
    return e(Text, props, text);
};

const styles = StyleSheet.create({
    container: {
	marginTop: 21
    }
});

// The 7 letters in circle of fifths order.
const root_letters = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];

// Enum: Qualities
const major = 0;
const minor = 1;
const diminished = 2;
const dominant = 3;
const quality_texts = ["", "m", "dim", "dom"];

// Qualities of chords ordered by scale steps
const major_qualities = [major, minor, minor, major, dominant, minor, diminished];
const minor_qualities = [minor, diminished, major, minor, minor, major, dominant];

// Circle of Fifth's Offsets of scale tones
const major_scale_offsets = [0, 2, 4, -1, 1, 3, 5];
const minor_scale_offsets = [0, 2, -3, -1, 1, -4, -2];

// Enum: Tonal Gravity Transitions
const step_up = 0;
const step_down = 1;
const leap_up = 2;
const leap_down = 3;
const parallel_motion = 4;
const tonal_gravity_transition_texts = ["↑", "↓", "↟", "↡", "≈"];

const natural_text = 'NAT';
const flat_text = 'b';
const double_flat_text = 'bb';
const sharp_text = '#';
const double_sharp_text = '##';

const numeral_texts = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

const roman_numeral_dominant_text = '7';
const roman_numeral_diminished_text = 'o';
const scale_length = 7;

const make_tone = function(letter, num_accidentals) {
    return { letter: letter,
	     num_accidentals: num_accidentals,
	   };
}

const make_chord = function(root, quality) {
    return { root: root, quality: quality };
};

const quality_text = function (quality) {
    return quality_texts[quality];
};

const tonal_gravity_transition_text = function(transition) {
    return tonal_gravity_transition_texts[transition];
};

const accidental_text = function(num_accidentals) {
    switch (num_accidentals) {
    case -2: return double_flat_text;
    case -1: return flat_text;
    case 1: return sharp_text;
    case 2: return double_sharp_text;
    }
    console.assert(num_accidentals >= -2 && num_accidentals <= 2, "Too many sharps or flats.")
    return '';
}

const root_text = function (root) {
    return root.letter.toUpperCase() + accidental_text(root.num_accidentals);
};

const root_tone_from_fifth_position = function(idx) {
    if (idx < 0) { // negative number indicates flat
	var num_flats = Math.trunc(-idx / (scale_length + 1)) + 1;
	idx += num_flats * scale_length;
	return make_tone(root_letters[idx % scale_length], -num_flats);
    }
    return make_tone(root_letters[idx % 7], Math.trunc(idx / scale_length));
};

const fifth_position = function (r) {
    // Convert a tone into an index into the circle of fifths.
    // ..., eb=-2, bb = -1, f = 0, c = 1, g = 2, ...
    return root_letters.indexOf(r.letter) + r.num_accidentals * scale_length;
};

const tonal_gravity_transition = function(r1, r2) {
    // one of [lu, ld, su, sd, pm]
    // Calculate the transition from r1 to r2
    var f1 = fifth_position(r1), f2 = fifth_position(r2);
    if (f1 === f2) {
	return parallel_motion;
    }
    if (f2 === f1 - 1) {
	return step_down;
    }
    if (f2 === f1 + 1) {
	return step_up;
    }
    if (f2 < f1) {
	return leap_down;
    }
    return leap_up;
};

const chord_text = function(chord) {
    return root_text(chord.root) + quality_text(chord.quality);
};

const chords_eql = function(c1, c2) {
    // True if two chords are the exact same.
    return c1.root.letter == c2.root.letter && 
	c1.root.num_accidentals == c2.root.num_accidentals && 
	c1.quality == c2.quality;
}

const roman_numeral_text = function(scale_step, quality) {
    // scale_step: 0-6
    var text = numeral_texts[scale_step];
    if (quality == major || quality == dominant) {
	text = text.toUpperCase();
	if (quality == dominant)
	    text += roman_numeral_dominant_text;
    } else if (quality == diminished) {
	text += ' ' + roman_numeral_diminished_text;
    }
    return text;
}

const composition_analysis = function(composition_chords, key) {
    // Analysis: [{chord, scale_step, tonal_gravity_transition}]
    
    var chords = diatonic_chords(key);
    var analysis = [];
    
    for (var i = 0; i < composition_chords.length; ++i) {
	var chord = composition_chords[i];
	var tmp = { chord: chord };
	
	var scale_step = null;
	if (key) {
	    for (var j = 0; j < chords.length; j++) {
		if (chords_eql(chord, chords[j])) {
		    scale_step = j;
		}
	    }
	}
	tmp.scale_step = scale_step;
	
	var is_first_chord = i === 0;
	var tg = null;
	if (!is_first_chord) {
	    var prev_chord = composition_chords[i - 1];
	    tg = tonal_gravity_transition(prev_chord.root, chord.root);
	}
	tmp.tonal_gravity_transition = tg;
	analysis.push(tmp);
    }
    return analysis;
}

const diatonic_chord = function(key, scale_step) {
    // scale_step: 1-7
    var p = fifth_position(key.root);
    scale_step = (scale_step - 1) % 7;
    var is_major = key.quality == major;
    var offset = is_major ? major_scale_offsets[scale_step] : minor_scale_offsets[scale_step];
    var quality = is_major ? major_qualities[scale_step] : minor_qualities[scale_step];
    var p2 = p + offset;
    var tone = root_tone_from_fifth_position(p2);
    return make_chord(tone, quality);
}

const diatonic_chords = function(key) {
    // all of the diatonic chords in key
    var chords = [];
    for (var i = 1; i < 8; i++) {
	chords.push(diatonic_chord(key, i));
    }
    return chords;
}

const c_major = make_chord(make_tone('c', 0), major);
const ab_minor = make_chord(make_tone('a', -1), minor);

const grand_cadence = function(key) {
    return [diatonic_chord(key, 1),
	    diatonic_chord(key, 4),
	    diatonic_chord(key, 1),
	    diatonic_chord(key, 5),
	    diatonic_chord(key, 1)
	   ];
}

const composition_text = function(composition_chords, key) {
    // For testing
    var text = '';
    var analysis = composition_analysis(composition_chords, key);

    for (var i = 0; i < analysis.length; ++i) {
	var tmp = analysis[i];
	if (tmp.tonal_gravity_transition !== null) {
	    text += tonal_gravity_transition_text(tmp.tonal_gravity_transition) + ' ';
	}
	text += chord_text(tmp.chord);
	if (tmp.scale_step !== null) {
	    text += '(' + roman_numeral_text(tmp.scale_step, tmp.chord.quality) + ')';
	}
	text += ' ';
    }
    return text;
}

const key_accidental_options = [flat_text, natural_text, sharp_text];
const accidental_options = [double_flat_text, flat_text, natural_text, sharp_text, double_sharp_text];
const accidental_text_to_num_accidentals = function(text) {
    switch (text) {
    case double_flat_text: return -2;
    case flat_text: return -1;
    case natural_text: return 0;
    case sharp_text: return 1;
    case double_sharp_text: return 2;
    }
    return 0;
}

const chord_quality_options = ['Major', 'Minor', 'Diminished', 'Dominant'];
const key_quality_options = ['Major', 'Minor'];
const chord_quality_text_to_chord_quality = function(text) {
    return chord_quality_options.indexOf(text);
}

const letter_options = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const cCompositionEditView = component({
    // TODO: convert from root_tone_options to make_tone()
    getInitialState: function() {
	return {composition: [],

		selected_key_letter: 'C',
		selected_key_accidental: natural_text,
		selected_key_quality: 'Major',

		selected_chord_letter: 'C',
		selected_chord_accidental: natural_text,
		selected_chord_quality: 'Major'
	       };
    },

    new_composition_pressed: function() {
	this.setState({composition: []});
    },

    add_chord_pressed: function() {
	this.setState(function (state) {
	    return {composition: state.composition.concat([this.selected_chord()])};
	});
    },

    // TODO: Refactor chooser menu.
    selected_key_letter_changed: function(option) {
	this.setState(function (state) {
	    return {selected_key_letter: option};
	});
    },
    selected_key_accidental_changed: function(option) {
	this.setState(function (state) {
	    return {selected_key_accidental: option};
	});
    },  
    selected_key_quality_changed: function(option) {
	this.setState(function (state) {
	    return {selected_key_quality: option};
	});
    },

    selected_chord_letter_changed: function(option) {
	this.setState(function (state) {
	    return {selected_chord_letter: option};
	});
    },
    selected_chord_accidental_changed: function(option) {
	this.setState(function (state) {
	    return {selected_chord_accidental: option};
	});
    },  
    selected_chord_quality_changed: function(option) {
	this.setState(function (state) {
	    return {selected_chord_quality: option};
	});
    },


    selected_key_tone: function() {
	var letter = this.state.selected_key_letter.toLowerCase();
	var num_accidentals = accidental_text_to_num_accidentals(this.state.selected_key_accidental);
	return make_tone(letter, num_accidentals);
    },
    selected_key: function() {
	return make_chord(this.selected_key_tone(),
			  chord_quality_text_to_chord_quality(this.state.selected_key_quality));
    },

    selected_chord_tone: function() {
	var letter = this.state.selected_chord_letter.toLowerCase();
	var num_accidentals = accidental_text_to_num_accidentals(this.state.selected_chord_accidental);
	return make_tone(letter, num_accidentals);
    },
    selected_chord: function() {
	return make_chord(this.selected_chord_tone(),
			  chord_quality_text_to_chord_quality(this.state.selected_chord_quality));
    },

    render: function() {
	return e(View, {style: styles.container}, [
	    eText("Key"),

	    e(SegmentedControls,
	      {options: letter_options,
	       onSelection: this.selected_key_letter_changed,
	       selectedOption: this.state.selected_key_letter}),
	    e(SegmentedControls,
	      {options: key_accidental_options,
	       onSelection: this.selected_key_accidental_changed,
	       selectedOption: this.state.selected_key_accidental}),
	    e(SegmentedControls,
	      {options: key_quality_options,
	       onSelection: this.selected_key_quality_changed,
	       selectedOption: this.state.selected_key_quality}),

	    eText("Chord"),

	    e(SegmentedControls,
	      {options: letter_options,
	       onSelection: this.selected_chord_letter_changed,
	       selectedOption: this.state.selected_chord_letter}),
	    e(SegmentedControls,
	      {options: accidental_options,
	       onSelection: this.selected_chord_accidental_changed,
	       selectedOption: this.state.selected_chord_accidental}),
	    e(SegmentedControls,
	      {options: chord_quality_options,
	       onSelection: this.selected_chord_quality_changed,
	       selectedOption: this.state.selected_chord_quality}),
	    
            e(Button, {title: 'Add Chord', onPress: this.add_chord_pressed}),
	    eText('Composition'),
            eText(composition_text(this.state.composition, this.selected_key())),
	    e(Button, {title: 'New Composition', onPress: this.new_composition_pressed})
        ]);
    }
});

// component
// accessed by the Main Menu sidebar
// export const CompositionContainer = function () { 
//     return e(cCompositionEditView);
// }

export default cCompositionEditView;
