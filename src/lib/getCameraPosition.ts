import { Match } from "effect";
import { scaleLinear } from "d3-scale";
import { kmScale } from "./utils";
import { stage } from "~/src/stores/stage.svelte";

const STARTING_POSITION: [number, number, number] = [0, 36, -60];
const TAKEOFF_POSITION: [number, number, number] = [0, 0, 0];
const ENDING_POSITION: [number, number, number] = [0, 0, -380];

export const getCameraPosition = (
  pageScrollBottom: number,
  currentSectionName: string,
): [number, number, number] => {
  const yScale = scaleLinear([0, 1], [STARTING_POSITION[1], 0]).clamp(true);

  function travelSection(
    start: string,
    end: string,
    fromKm: number,
    toKm: number,
  ): [number, number, number] {
    const progress = stage.getProgressBetweenSections({ start, end })(
      pageScrollBottom,
    );
    const z = scaleLinear([0, 1], [kmScale(fromKm), kmScale(toKm)]).clamp(true)(
      progress,
    );
    return [0, 0, z];
  }

  function zoomFromArtemisToSls() {
    const scrollProgress = stage.getProgressBetweenSections({
      start: "artemis",
      end: "sls",
    })(pageScrollBottom);

    const zScale = scaleLinear([0, 1], [STARTING_POSITION[2], 0]).clamp(true);

    const sectionPosition: [number, number, number] = [
      0,
      yScale(scrollProgress),
      zScale(scrollProgress),
    ];

    return sectionPosition;
  }

  const position = Match.value(currentSectionName).pipe(
    Match.withReturnType<[number, number, number]>(),
    Match.when("initial", () => STARTING_POSITION),
    Match.when("intro", () => STARTING_POSITION),
    Match.when("orion", () => STARTING_POSITION),
    Match.when("artemis", () => zoomFromArtemisToSls()),
    Match.when("sls", () => TAKEOFF_POSITION),
    Match.when("takeoff", () => TAKEOFF_POSITION),
    Match.when("excitement", () => TAKEOFF_POSITION),
    Match.when("stratosphere", () =>
      travelSection("stratosphere", "maxq", 0, -12),
    ),
    Match.when("maxq", () => travelSection("maxq", "cornish", -12, -35)),
    Match.when("cornish", () => travelSection("cornish", "2mins", -35, -85)),
    Match.orElse(() => ENDING_POSITION),
  );

  return position;
};
