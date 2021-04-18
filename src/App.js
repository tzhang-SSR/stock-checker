import './App.css';
import React, { Component } from 'react';
import { getSymbol, getQuotes, getCandles, getUSSymbols } from './utils/api';
import Result from './components/Result';
import { Chart } from "react-google-charts";
import GraphChart from './components/GraphChart';

class App extends Component {
  state = {
    query: '',
    currPrice: 0,
    todayhigh: 0,
    todaylow: 0,
    todayopen: 0,
    prevclosed: 0,
    companyName: '',
    symbolName: '',
    showResult: false,
    isInvalid: false,
    errorText: '',
    dataPoints: []
  }

  componentDidMount() {
    this.storeSymbols()
  }

  storeSymbols = () => {
    if (!localStorage.getItem('symbols')) {
      const param = `token=${process.env.REACT_APP_API_KEY}`
      let response = getUSSymbols(param)
      let resolved = response.then(res => {
        let symbols = []
        for (let i of res) {
          symbols.push(i.symbol)
        }
        localStorage.setItem('symbols', symbols)
      })
    }
  }

  onSearch = () => {
    const param = `?q=${this.state.query}&token=${process.env.REACT_APP_API_KEY}`
    let response = getSymbol(param)
    let resolved = response.then(res => this.checkResult(res.result))
    let error = resolved.catch(e => {
      if (e) {
        console.log(e)
        this.setState({ isInvalid: true, errorText: "E" })
      }
    })
  }

  checkResult = (result) => {
    // if result.length == 0 then the search word is not valid
    this.setState({ isInvalid: !result.length })
    if (result.length) {
      let companyName = result[0].description
      let symbolName = result[0].symbol
      this.setState({ showResult: true, companyName, symbolName })
      this.getQuoteData(symbolName)
      this.getGraphData(symbolName)
    }
    else {
      const errorText = 'No result for this search. Please try another word'
      this.setState({ errorText })
    }
  }

  getQuoteData = (symbol) => {
    const param = `?symbol=${symbol}&token=${process.env.REACT_APP_API_KEY}`
    let response = getQuotes(param)
    let resolved = response.then(res => this.setState({
      currPrice: res.c,
      todayhigh: res.h,
      todaylow: res.l,
      todayopen: res.o,
      prevclosed: res.pc
    }))
    let error = resolved.catch(e => console.log(e))
  }

  getGraphData = (symbol) => {
    const prevYear = new Date().getFullYear() - 1
    const currTime = Date.parse(new Date(`12/31/${prevYear}`)) / 1000
    const prevTime = Date.parse(new Date(`01/01/${prevYear}`)) / 1000
    const url = 'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=M&from=1615298999&to=1615302599'
    const param = `?symbol=${symbol}&resolution=D&from=${prevTime}&to=${currTime}&token=${process.env.REACT_APP_API_KEY}`

    let response = getCandles(param)
    let resolved = response.then(res => {
      if (res.s == "ok") {
        this.drawGraphs(res)
      }
    }
    )
    let error = resolved.catch(e => console.log(e))
  }

  drawGraphs = (res) => {
    let dataPoints = []
    for (let i = 0; i < res.t.length; i++) {
      let data = [new Date(res.t[i] * 1000), res.c[i]]
      dataPoints.push(data)
    }

    this.setState({ dataPoints })
  }

  render() {
    const {
      query, currPrice, companyName, symbolName,
      todayhigh, todaylow, todayopen, prevclosed,
      showResult, isInvalid, errorText, dataPoints
    } = this.state;

    const quoteData = [
      { labelName: 'Previous Close: ', labelNum: prevclosed },
      { labelName: 'Todays Open: ', labelNum: todayopen },
      { labelName: 'Todays High: ', labelNum: todayhigh },
      { labelName: 'Todays Low: ', labelNum: todaylow }
    ];

    const dataNotEmpty = dataPoints.length > 0

    return (
      <div className="App">
        <div className="main">
          <div className="search">
            <div>Enter Ticker Symbol:</div>
            <input type="text" placeholder="TICKER"
              value={query}
              onChange={e => this.setState({ query: e.target.value, showResult: false })} />
            <button onClick={this.onSearch}>&#10132;</button>
            {
              isInvalid
                ? <p>{errorText}</p>
                : showResult &&
                  <Result
                    symbolName={symbolName}
                    companyName={companyName}
                    currPrice={currPrice}
                    quoteData={quoteData} />
            }
          </div>
          <div className="graph">
            {dataNotEmpty &&
              <GraphChart dataPoints={dataPoints} />
            }
          </div>
        </div>
      </div>
    );
  }
}


export default App;
