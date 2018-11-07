import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import SexSelector from "../components/SexSelectorComponent";

class AppSettingsScreen extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View style={styles.container}>
        <SexSelector/>
      </View>
    );
  }
}

export default AppSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", 
  }
});
