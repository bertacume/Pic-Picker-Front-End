import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import SettingsComponent from "../components/SettingsComponent";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class AppSettingsScreen extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View style={styles.container}>
       <SettingsComponent></SettingsComponent>
      </View>
    );
  }
}

export default AppSettingsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: 'column',
    alignItems: 'center'
  }
});
