import React, {useState, useEffect} from "react";
import {Button, View, Text, StyleSheet, useWindowDimensions} from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler, FlatList } from 'react-native-gesture-handler';
import WebView from "react-native-webview";
import * as Contacts from 'expo-contacts';


export default () => {

  //contacts
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
      }
    })();
  }, []);

  const contact = {
    [Contacts.Fields.FirstName]: 'Bird',
    [Contacts.Fields.LastName]: 'Man',
    [Contacts.Fields.Company]: 'Young Money',
  };

  console.log(contact);

  //web-view open from press on button:
  const [state, setState] = useState(0);


  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height);
  const style = useAnimatedStyle(()=>{
    return {
      top: withSpring(top.value,{
        damping:80,
        overshootClamping:true,
        restDisplacementThreshold:0.1,
        restSpeedThreshold:0.1,
        stiffness:500,
        position:'absolute',
      })
    };
  });
  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context){
      context.startTop = top.value;
    },
    onActive(event, context){
      top.value = context.startTop+event.translationY;
    },
    onEnd(){
      if(top.value> dimensions.height/2+200){
        top.value=dimensions.height;
      }else{
        top.value=dimensions.height/2;
      }
    }
  });

  if (state!==0)
    return(
        <WebView
          style={styles.container}
          source={{ uri: 'https://expo.dev' }}
        />
    );

  return (
      <>
        <View style={styles.container}>
          <Button title={'Open Sheet'} onPress={()=>{
            top.value = withSpring(
                dimensions.height/2,
                {
                  damping:80,
                  overshootClamping:true,
                  restDisplacementThreshold:0.1,
                  restSpeedThreshold:0.1,
                  stiffness:500,
                }
            )
          }}/>
          <Button title={'Open WebView'} onPress={()=>(setState(1))}/>
          <Text>Contact Book is working too</Text>
        </View>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.animate, style]}>
            <Text>Sheeeeeet</Text>
          </Animated.View>
        </PanGestureHandler>

      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animate:{
    position:'absolute',
    left:0,
    top:0,
    bottom: 0,
    backgroundColor: "#fff9df",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#69674e",
    shadowOffset:{
      width:0,
      height:2,
    },
    shadowOpacity:0.25,
    shadowRadius:3.84,
    elevation: 5,
    padding:20,
    justifyContent:'center',
    alignItems:'center',
  },
});
