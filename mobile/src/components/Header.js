import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function Header({ title, subtitle }) {
  return <View style={styles.wrap}><Text style={styles.title}>{title || 'DM-System'}</Text>{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>;
}
const styles=StyleSheet.create({wrap:{marginBottom:14},title:{fontSize:24,fontWeight:'900',color:'#1b2854'},subtitle:{fontSize:14,color:'#788397',marginTop:4}});
