import React, { useState, useEffect } from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  DiscreteColorLegend,
  LineSeries,
} from "react-vis";

const Chart = ({ data }) => {
  let [deaths, setDeaths] = useState(null);
  let [cases, setCases] = useState(null);
  let [caseData, setCaseData] = useState(null);
  let [deathData, setDeathData] = useState(null);

  useEffect(() => {
    let totalCases = 0;
    let totalDeaths = 0;
    let days = data.length;
    let casesArr = [];
    let deathsArr = [];

    data.forEach((day, i) => {
      let date = day.date.toString();
      console.log(day);

      if (i < 7) {
        totalDeaths += day.deathIncrease;
        deathsArr.push({ x: date, y: day.deathIncrease });
      } else {
        totalCases += day.positiveIncrease;
        casesArr.push({ x: date, y: day.positiveIncrease });
      }
    });
    setCases(totalCases / days);
    setDeaths(totalDeaths / days);
    setCaseData(casesArr);
    setDeathData(deathsArr);
  }, []);

  console.log("deaths", deaths);
  console.log("cases", cases);
  console.log(caseData);

  const formatXAxis = (val) => {
    val = val.toString().substring(4);
    val = val.substring(0, 2) + "/" + val.substring(2);
    return val;
  };

  return (
    <div>
      <div>
        <h3>COVID Data</h3>
        {data && (
          <div>
            <div>
              <XYPlot width={1000} height={500}>
                <LineSeries color="red" data={caseData} />
                <LineSeries color="blue" data={deathData} />
                <XAxis
                  title="Date"
                  tickTotal={14}
                  tickFormat={(val) => formatXAxis(val)}
                />
                <YAxis title="Cases" />
              </XYPlot>
              <DiscreteColorLegend
                items={[
                  {
                    title: "Cases Increase Per Day",
                    color: "red",
                  },
                  {
                    title: "Deaths Increase Per Day",
                    color: "blue",
                  },
                ]}
              />
              <XYPlot width={1000} height={500}>
                <LineSeries color="blue" data={deathData} />
                <XAxis
                  title="Date"
                  tickTotal={14}
                  tickFormat={(val) => formatXAxis(val)}
                />
                <YAxis title="Cases" />
              </XYPlot>
              <DiscreteColorLegend
                items={[
                  {
                    title: "Deaths Increase Per Day",
                    color: "blue",
                  },
                ]}
              />
            </div>
            <div>
              <h6>Cases: {Math.round(cases)}</h6>
              <h6>Average deaths a day last 7 days: {Math.round(deaths)}</h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
