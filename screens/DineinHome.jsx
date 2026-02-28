import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import DineinSeach from '../components/DininHome/DineinSearch';
import Header from '../components/Header';
import DineinCategory from '../components/DininHome/DineinCategory';

const DineinHome = () => {
  return (
    <View>
      <Header />
      <DineinSeach />
      <DineinCategory />
    </View>
  );
};

export default DineinHome;

const styles = StyleSheet.create({});
