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
  let [showData, toggleShowData] = useState(false);

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

  const formatDate = (val) => {
    val = val.toString().substring(4);
    val = val.substring(0, 2) + "/" + val.substring(2);
    return val;
  };

  const chartWidth = window.innerWidth > 978 ? 900 : window.innerWidth * 0.9;
  const toggleData = () => {
    toggleShowData(!showData);
  };

  console.log(data);

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
                    <th>Average cases a day the previous 2 weeks</th>
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
            <div>
              <div onClick={toggleData} className="button-holder">
                <button className="btn btn-primary">
                  {showData ? "hide data" : "show more data"}
                </button>
                <div>
                  {showData && (
                    <>
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Cases</th>
                            <th>Deaths</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map(
                            ({ date, positiveIncrease, deathIncrease }, i) => {
                              return (
                                <tr key={i}>
                                  <td>{formatDate(date)}</td>
                                  <td>{positiveIncrease}</td>
                                  <td>{deathIncrease}</td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                      <table>
                        <thead>
                          <th>Cumulative State Cases</th>
                          <th>Cumulative State Deaths</th>
                        </thead>
                        <tbody>
                          <tr className="total-row">
                            <td>{data[0].positive}</td>
                            <td>{data[0].death}</td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  h3,
  h6 {
    text-align: center;
    margin: 50px auto;
  }
  .button-holder {
    text-align: center;
    margin: 0 auto 50px;
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

    .total-row {
      border-top: 3px solid black;
      text-align: left;
    }
  }
`;

export default Chart;
