import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import Chart from "./Chart";

function App() {
  const apiUrl = "https://covidtracking.com/api/v1";
  let [states, setStates] = useState([]);
  let [activeState, setActiveState] = useState(null);
  let [stateData, setStateData] = useState([]);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    const res = axios
      .get(`${apiUrl}/states/info.json`)
      .then(({ data }) => setStates(data))
      .catch((err) => console.log(err));
  }, []);

  const handleStateClick = (state) => {
    setActiveState(state);
    getStateData(state);
  };

  const getStateData = async (state, customDate) => {
    setLoading(true);
    let dataArr = [];

    for (var i = 1; i <= 21; i++) {
      let day = null;
      if (customDate) {
      } else {
        day = moment().subtract(i, "days").format("YYYYMMDD");
      }

      const data = await axios
        .get(`${apiUrl}/states/${state.toLowerCase()}/${day}.json`)
        .then(({ data }) => data)
        .catch((err) => console.log(err));
      dataArr.push(data);
    }

    setStateData(dataArr);
    setLoading(false);
  };
  return (
    <Container>
      <div>
        <div className="select-state">
          <h6>Select a state</h6>
        </div>
        <div className="dropdown">
          {states.map(({ state }, i) => (
            <div key={i} onClick={() => handleStateClick(state)}>
              {state}
            </div>
          ))}
        </div>
      </div>
      <div>
        {loading && <h1>Loading...</h1>}
        {stateData.length > 0 && !loading && (
          <Chart data={stateData} activeState={activeState} />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin: 10px;
  .select-state {
    text-align: center;
    margin: 20px 0;
    color: #26a69a;
  }
  .dropdown {
    max-width: 80vw;
    overflow-x: auto;
    min-width: 40px;
    display: flex;
    background: #26a69a;
    color: white;
    margin: auto;

    div {
      padding: 5px 10px;
      border-left: 1px solid white;
      border-right: 1px solid white;
      font-size: 20px;
      cursor: pointer;
    }
  }

  h1 {
    text-align: center;
    margin: 50px 0;
  }
`;

export default App;
