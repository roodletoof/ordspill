import { useEffect } from "react";

/**
  * Representation of an event that can be fired from within a reducer.
  * Construct a new event with newEvent or newEventWithPayload in your state.
  * In the reducer function you overwrite the event variable of the state with
  * the output from fireEvent or fireEventWithPayload to 'fire' it. To react to
  * an event you call eventEffect or eventEffectWithPayload on the event variable
  * of the state.
  */
export type Event<T = undefined> = {
  firedCount: number;
} & ([T] extends [undefined] ? {} : { payload: T });

export const newEvent = (): Event => ({
  firedCount: 0,
});

export const newEventWithPayload = <T>(): Event<T> => ({
  firedCount: 0,
  payload: undefined as T,
});

export const fireEvent = (e: Event): Event => ({
  firedCount: e.firedCount + 1,
});

export const fireEventWithPayload = <T>(
  e: Event<T>,
  payload: T
): Event<T> => ({
  fired: true,
  firedCount: e.firedCount + 1,
  payload: payload
});

export const useEventEffect = (
  event: Event,
  onEvent: () => void
) =>
  useEffect(() => {
    if (event.firedCount === 0) { return; }
    onEvent();
  }, [event]);

export const useEventEffectWithPayload = <T>(
  event: Event<T>,
  onEvent: (payload: T) => void,
) =>
  useEffect(() => {
    if (event.firedCount === 0) { return; }
    if (!("payload" in event)) { throw Error("the fired event does not have a payload"); }
    onEvent(event.payload);
  }, [event]);

