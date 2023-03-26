import {
  faArrowDown,
  faArrowTrendUp,
  faArrowUp,
  faSquarePollVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cpmToWPM } from "../../../common/utils/cpmToWPM";
import { toHumanReadableTime } from "../../../common/utils/toHumanReadableTime";
import ResultsChart from "../components/ResultsChart";
import { useGameStore } from "../state/game-store";
import { useTrendStore } from "../state/trends-store";

function ResultsText({ title, value }: { title: string; value: string }) {
  return (
    <div className="h-full flex flex-col justify-end px-2 w-full sm:w-[150px] bg-dark-lake rounded p-2 py-4">
      <p className="flex justify-start color-inherit font-bold text-off-white text-xs">
        {title}
      </p>
      <div className="flex items-center gap-2 text-faded-gray justify-between">
        <p className="font-bold text-2xl">{value}</p>
      </div>
    </div>
  );
}

export function ResultsContainer() {
  const result = useGameStore((state) => state.myResult);
  // TODO: Show loading indicator here
  if (!result) return null;
  const cpm = result.cpm;
  const wpm = cpmToWPM(cpm);
  const ms = result.timeMS;
  const time = toHumanReadableTime(Math.floor(ms / 1000));
  const mistakesCount = result.mistakes;
  const accuracy = result.accuracy;
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row gap-4 justify-between mb-2">
        <div className="flex flex-col gap-1 mx-2 w-full">
          <h3 className="px-2 flex color-inherit font-bold text-faded-gray text-sm items-center gap-2">
            <FontAwesomeIcon
              className="h-5 w-5 flex items-center justify-center"
              icon={faSquarePollVertical}
            />
            result
          </h3>
          <div className="w-full grid grid-cols-2 sm:flex sm:flex-row gap-2">
            <ResultsText title="words per minute" value={wpm.toString()} />
            <ResultsText title="accuracy" value={`${accuracy}%`} />
            <ResultsText title="time" value={time} />
            <ResultsText title="mistakes" value={mistakesCount.toString()} />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row">
        {!result.user.isAnonymous ? <TrendsWPM currWPM={wpm} /> : null}
        <ResultsChart />
      </div>
    </div>
  );
}

function TrendsWPM({ currWPM }: { currWPM: number }) {
  const { threeGameWPM, tenGameWPM, todayWPM } = useTrendStore();
  const noResults = !threeGameWPM && !tenGameWPM && !todayWPM;
  if (noResults) {
    return null;
  }
  return (
    <div className="mx-2 flex flex-col sm:justify-start gap-1">
      <h3 className="px-2 flex color-inherit font-bold text-faded-gray text-sm items-center gap-2">
        <FontAwesomeIcon
          className="h-5 w-5 flex items-center justify-center"
          icon={faArrowTrendUp}
        />
        average wpm
      </h3>
      <div className="flex flex-col gap-2 h-full">
        {threeGameWPM ? (
          <HistoryicalResult
            title={"last 3 games"}
            currWPM={currWPM}
            wpm={threeGameWPM}
          />
        ) : null}
        {tenGameWPM ? (
          <HistoryicalResult
            title={"last 10 games"}
            currWPM={currWPM}
            wpm={tenGameWPM}
          />
        ) : null}
        {todayWPM ? (
          <HistoryicalResult title={"today"} currWPM={currWPM} wpm={todayWPM} />
        ) : null}
      </div>
    </div>
  );
}

function HistoryicalResult({
  title,
  currWPM,
  wpm,
}: {
  title: string;
  currWPM: number;
  wpm: number;
}) {
  const percentageChange = (currWPM / wpm) * 100 - 100;
  const popover =
    percentageChange > 0
      ? `This race was ${Math.abs(percentageChange).toFixed(
          0
        )}% faster than the average ${title} (wpm)`
      : `This race was ${Math.abs(percentageChange).toFixed(
          0
        )}% slower than the average ${title} (wpm)`;
  return (
    <div
      title={popover}
      className="h-full flex flex-col justify-center px-2 sm:w-[150px] bg-dark-lake rounded p-2 gap-1"
    >
      <p className="flex justify-start color-inherit tracking-wide font-semibold text-off-white text-sm">
        {title}
      </p>
      <div className="flex items-center gap-2 text-faded-gray justify-between">
        <p className="font-bold text-2xl flex">
          {wpm}{" "}
          <span className="flex text-xs flex-col justify-end pl-1">/wpm</span>
        </p>
        <div className="font-bold text-xs flex items-center gap-1">
          {percentageChange > 0 ? (
            <div className="h-2 w-2 text-green-500">
              <FontAwesomeIcon icon={faArrowUp} />
            </div>
          ) : (
            <div className="h-2 w-2 text-red-500">
              <FontAwesomeIcon icon={faArrowDown} />
            </div>
          )}
          {Math.abs(percentageChange).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
