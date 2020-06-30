import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import Chart from "./Chart";

function App() {
  const apiUrl = "https://covidtracking.com/api/v1";
  let [states, setStates] = useState("");
  let [activeState, setActiveState] = useState(null);
  let [dropdownActive, toggleDropdownActive] = useState(false);
  let [stateData, setStateData] = useState([]);

  useEffect(() => {
    const res = axios
      .get(`${apiUrl}/states/info.json`)
      .then(({ data }) => setStates(data))
      .catch((err) => console.log(err));
  }, []);

  const handleStateClick = (state) => {
    setActiveState(state);
    toggleDropdownActive(false);
    getStateData(state);
  };

  const getStateData = async (state) => {
    let dataArr = [];

    for (var i = 1; i <= 21; i++) {
      let day = moment().subtract(i, "days").format("YYYYMMDD");
      const data = await axios
        .get(`${apiUrl}/states/${state.toLowerCase()}/${day}.json`)
        .then(({ data }) => data)
        .catch((err) => console.log(err));
      dataArr.push(data);
    }

    setStateData(dataArr);
  };
  return (
    <Container>
      <div>
        <div onClick={() => toggleDropdownActive(!dropdownActive)}>
          {activeState || "Select a state"}
        </div>
        {dropdownActive && (
          <div className="dropdown">
            {states.map(({ state }, i) => (
              <div key={i} onClick={() => handleStateClick(state)}>
                {state}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>{stateData.length && <Chart data={stateData} />}</div>
    </Container>
  );
}

const Container = styled.div`
  margin: 10px;
  .dropdown {
    max-height: 200px;
    overflow-y: auto;
    min-width: 40px;
    display: inline-block;
    background: grey;

    div {
      padding: 5px 10px;
      border-top: 1px solid white;
      border-bottom: 1px solid white;
      font-size: 20px;
    }
  }
`;

export default App;
