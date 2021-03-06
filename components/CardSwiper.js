import React from "react";
import {Dimensions, Image, View, PanResponder, Animated} from "react-native";
import { connect } from 'react-redux';
import { changeCredits, changeStream, changeUser } from '../redux/actions/actions';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class CardSwiper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
    };
    this.imageStream = [
      {id: 1, uri: 'https://res.cloudinary.com/diek0ztdy/image/upload/v1542100372/dickPicker/banana5.jpg'},
      {id: 2, uri: 'https://res.cloudinary.com/diek0ztdy/image/upload/v1542100372/dickPicker/banana10.jpg'},
      {id: 3, uri: 'https://res.cloudinary.com/diek0ztdy/image/upload/v1542100372/dickPicker/banana1.jpg'},
      {id: 4, uri: 'https://res.cloudinary.com/diek0ztdy/image/upload/v1542100372/dickPicker/banana4.jpg'}
    ]
    this.position = new Animated.ValueXY();
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp"
    });

    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    });

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp"
    });

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: "clamp"
    });

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp"
    });
  }

  _createVote = (index,isUpVote) => {
    const image = this.props.imageStream[index];
    this.props.changeCredits(this.props.credits + 1);
    const body = {...this.props.user, imageId: image.id, isUpVote: isUpVote};
    fetch('http://localhost:3000/addview', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify(body)
    })
    .catch((error)=> {
      console.log(error);
    })
    fetch('http://localhost:3000/incrementCredits', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        id: this.props.user.id
      })
    })
    .then(res => res.json())
    .then(res => {
      this.props.changeUser(res);
    })
    .catch((error)=> {
      console.log(error);
    })
  }
  
  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (e, gestureState) => {
        if(gestureState.dx>120) {
          Animated.spring(this.position, {
            toValue: {x: SCREEN_WIDTH + 100, y:gestureState.dy} 
          }).start(()=>{
            const index = this.state.currentIndex;
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x:0, y:0});
              this._createVote(index, true);
            });
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: {x: -SCREEN_WIDTH -100, y: gestureState.dy}
          }).start(() => {
            const index = this.state.currentIndex;
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x:0,y:0});
              this._createVote(index, false);
            })
          })
        }
      }
    });
  }

  componentDidMount = () => {
    fetch('http://localhost:3000/imagestream', {
      method: 'GET',
      headers: {
        'userId': this.props.user.id,
        'lastImageId': 0
      }
    })
    .then((res) => res.json())
    .then((res) => {
      this.props.changeStream(res);
    })
    .catch((error)=> {
      console.log(error);
    } )
  }

  renderImages = () => {
    return this.props.imageStream
      .map((item, i) => {
        const uri = {uri: item.uri.toString()};
        if (i < this.state.currentIndex) {
          return null;
        } else if (i === this.state.currentIndex) {
          return (
            
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.id}
              style={[
                this.rotateAndTranslate,
                {
                  flex: 1,
                  height: SCREEN_HEIGHT - 170,
                  width: SCREEN_WIDTH,
                  position: "absolute",
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingLeft: 10,
                  paddingRight: 10
                }
              ]}
            >
              <Animated.View
                style={{
                  opacity: this.likeOpacity,
                  transform: [{ rotate: "-30deg" }],
                  position: "absolute",
                  top: 40,
                  left: 30,
                  zIndex: 1000
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    height: 100,
                    width: 100
                  }}
                  source={require("../assets/smileys/1.png")}
                />
              </Animated.View>
              <Animated.View
                style={{
                  opacity: this.dislikeOpacity,
                  transform: [{ rotate: "30deg" }],
                  position: "absolute",
                  top: 40,
                  right: 30,
                  zIndex: 1000
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    height: 100,
                    width: 100
                  }}
                  source={require("../assets/smileys/4.png")}
                />
              </Animated.View>
              <Image
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: "cover",
                  borderRadius: 20
                }}
                source={uri}
              />
            </Animated.View>
          );
        } else {
          return (
            <Animated.View
              key={item.id}
              style={[
                {
                  flex: 1,
                  height: SCREEN_HEIGHT - 170,
                  width: SCREEN_WIDTH,
                  position: "absolute",
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingLeft: 10,
                  paddingRight: 10
                },
                {
                  opacity: this.nextCardOpacity,
                  transform: [{ scale: this.nextCardScale }]
                }
              ]}
            >
              <Image
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: "cover",
                  borderRadius: 20
                }}
                source={uri}
              />
            </Animated.View>
          );
        }
      }).reverse();
  };

  render() {
    return <View style={{ flex: 1 }}>{this.renderImages()}</View>;
  }
}

const mapStateToProps = (state) => ({
  credits: state.user.credits,
  imageStream: state.imageStream,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  changeCredits: (credits) => dispatch(changeCredits(credits)),
  changeStream: (stream) => dispatch(changeStream(stream)),
  changeUser: (user) => dispatch(changeUser(user))
});

export default connect(mapStateToProps,mapDispatchToProps) (CardSwiper);