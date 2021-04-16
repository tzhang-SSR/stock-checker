import './App.css';

function App() {
  return (
    <div className="App">
      <div className="main">
        <div className="search">
          <div>Enter Ticker Symbol:</div>
          <form>
            <input type="text" placeholder="TICKER" />
            <input type="submit" value="submit" />
          </form>
          <p>APPL</p>
          <div className="search-result">
            <div>
              <div>Apple Inc</div>
              <p>107.78</p>
            </div>
            <div>
            {/*get realy time quotes with given symbol */}
              <div><span>Previous Close: </span><span>107.34</span></div>
              <div><span>Previous Close: </span><span>107.34</span></div>
              <div><span>Previous Close: </span><span>107.34</span></div>
              <div><span>Previous Close: </span><span>107.34</span></div>
            </div>
          </div>
        </div>
        <div className="graph"></div>
      </div>
    </div>
  );
}

export default App;
