import { Effect } from "effect";

export const effectTry = <A, E>(effect: Effect.Effect<A, E>) => {
  try {
    const value = Effect.runSync(effect);
    return [null, value] as const;
  } catch (error) {
    return [error as E, null] as const;
  }
};

export default effectTry;
