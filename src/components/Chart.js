import React, { useState, useEffect } from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  DiscreteColorLegend,
  LineSeries,
} from "react-vis";
import styled from "styled-components";

const Chart = ({ data, activeState }) => {
  let [deaths, setDeaths] = useState(null);
  let [cases, setCases] = useState(null);
  let [caseData, setCaseData] = useState(null);
  let [deathData, setDeathData] = useState(null);

  useEffect(() => {
    let totalCases = 0;
    let totalDeaths = 0;

    let casesArr = [];
    let deathsArr = [];

    data.forEach((day, i) => {
      let date = day.date.toString();

      if (i < 7) {
        totalDeaths += day.deathIncrease;
        deathsArr.push({ x: date, y: day.deathIncrease });
      } else {
        totalCases += day.positiveIncrease;
        casesArr.push({ x: date, y: day.positiveIncrease });
      }
    });
    setCases(totalCases / 14);
    setDeaths(totalDeaths / 7);
    setCaseData(casesArr);
    setDeathData(deathsArr);
  }, [data]);

  console.log(caseData);

  const formatDate = (val) => {
    val = val.toString().substring(4);
    val = val.substring(0, 2) + "/" + val.substring(2);
    return val;
  };

  const chartWidth = window.innerWidth > 978 ? 900 : window.innerWidth * 0.9;

  return (
    <Container>
      <div>
        <h3>
          COVID Data for {activeState} from&nbsp;
          {formatDate(data[data.length - 1].date)} to {formatDate(data[0].date)}
        </h3>
        {data && (
          <div>
            <div className="charts">
              <XYPlot width={chartWidth} height={600}>
                <LineSeries color="red" data={caseData} />
                <LineSeries color="blue" data={deathData} />
                <XAxis
                  title="Date"
                  tickTotal={14}
                  tickFormat={(val) => formatDate(val)}
                />
                <YAxis title="Cases" />
              </XYPlot>
              <DiscreteColorLegend
                items={[
                  {
                    title: "Cases Per Day",
                    color: "red",
                  },
                  {
                    title: "Deaths Per Day",
                    color: "blue",
                  },
                ]}
              />
              <XYPlot width={chartWidth} height={500}>
                <LineSeries color="blue" data={deathData} />
                <XAxis
                  title="Date"
                  tickTotal={7}
                  tickFormat={(val) => formatDate(val)}
                />
                <YAxis title="Deaths" />
              </XYPlot>
              <DiscreteColorLegend
                items={[
                  {
                    title: "Deaths Per Day",
                    color: "blue",
                  },
                ]}
              />
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Cases a day the previous 2 weeks</th>
                    <th>Average deaths a day last 7 days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{Math.round(cases)}</td>
                    <td>{Math.round(deaths)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  h3 {
    text-align: center;
    margin: 50px auto;
  }
  .charts {
    margin: 25px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  table {
    width: 80%;
    margin: 50px auto;
    th,
    td {
      text-align: center;
    }
  }
`;

export default Chart;
