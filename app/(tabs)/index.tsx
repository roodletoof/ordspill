import { Button, View } from "react-native";
import CustomKeyboard from "../components/CustomKeyboard";
import GuessView from "../components/GuessView";
import { SafeAreaView } from "react-native-safe-area-context";
import useGameStateReducer from "@/helpers/GameState";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useEventEffect, useEventEffectWithPayload } from "@/helpers/event";
import usePopup from "../components/Popup";

export default function Index() {
  const [state, dispatch] = useGameStateReducer();

  const rotationAnimation = useSharedValue(0);
  useEventEffect(state.eventWrongInput, () => {
    const frametime = 20;
    const degrees = 1;
    rotationAnimation.value = withSequence(
      withRepeat(
        withSequence(
          withTiming(degrees, { duration: frametime }),
          withTiming(-degrees, { duration: frametime })
        ), 4
      ),
      withTiming(0, {duration: frametime})
    );
  });

  const shakingStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{rotate: `${rotationAnimation.value}deg`}],
  }));

  const winPopup = usePopup({ message: "Riktig! 🎉", });
  const losePopup = usePopup({ message: "Feil ☹️", });
  const answerPopup = usePopup({ message: state.targetWord });

  useEventEffectWithPayload(state.eventGameFinished, ({won}) => {
    if (won) winPopup.open();  
    else losePopup.open(); 
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#eee"
      }}
    >
      <winPopup.Component {...winPopup.props}/>
      <losePopup.Component {...losePopup.props}/>
      <answerPopup.Component {...answerPopup.props}/>

      <View style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 10
      }}>
        <Button title="nytt spill" onPress={() => dispatch({type: "NewGame"})} />
        <Button title="vis svar" onPress={answerPopup.open} />
        <Button title="hint" onPress={() => dispatch({type: "GiveHint"})} />
      </View>
      <GuessView
        state={state}
      />
      <Animated.View style={shakingStyle}>
        <CustomKeyboard
          state={state}
          dispatch={dispatch}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
