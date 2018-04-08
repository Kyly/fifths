import { default as React, Component } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, } from 'react-native';
import component from 'create-react-class';
import { perfect_fifth_markdown_text, musical_gravity_markdown_text, rules_for_chords_markdown_text, enharmonic_equivalents_markdown_text } from '../static/markdown.js'

// For Left<-->Right page swiping
import { default as Swiper } from 'react-native-swiper';

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

// element
const eReferences =
      e(View, {}, [
	  eText('Intervals'),
	  eText('Intervals are measured in half-steps'),
	  eText('Chords'),
	  eText('Chords are combinations of two or more intervals.')
      ]);

// StyleSheet
const swipeStyles = StyleSheet.create({
    wrapper: {
	marginTop: 50,
    },
    slide1: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#9DD6EB',
    },
    slide2: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#97CAE5',
    },
    slide3: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#92BBD9',
    },
    text: {
	color: '#fff',
	fontSize: 30,
	fontWeight: 'bold',
    }
});

// f(style, text) => component
const eSwipeView = function(style, text) {
    return e(View, {style: style}, [
        e(Text, {style:swipeStyles.text}, text),
    ]);
}

const e_md = function(md) {
    return e(ScrollView, {}, [e(Text, {}, [md])]);
}

// component
const cReferences = component({
    render: function() {
	return e(Swiper, {style: swipeStyles.wrapper, showButtons: true}, [
            e_md(perfect_fifth_markdown_text),
	    e_md(musical_gravity_markdown_text),
	    e_md(rules_for_chords_markdown_text),
	    e_md(enharmonic_equivalents_markdown_text),
        ]);
    }
})

// component
// accessed by the Main Menu sidebar
// export const ReferencesContainer = function () { 
//     //return e(View, {}, eReferences);
//     return e(cReferences);
// }
export default cReferences;
