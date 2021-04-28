import './App.css';
import React, { Component } from 'react';
import { getSymbol, getQuotes, getCandles, getUSSymbols, getCompanyPeers } from './utils/api';
import Result from './components/result';
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
    peers: [],
    showResult: false,
    isInvalid: false,
    errorText: '',
    // graph data states
    loadingGraph: false,
    isGraphValid: true,
    graphError: '',
    dataPoints: [],
    histories: []
  }

  componentDidMount() {
    this.storeSymbols()
  }

  storeSymbols = () => {
    //store all the valid US ticker symbols
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

  validateInput = () => {
    // check if the input is in the stored symbols
    const symbols = localStorage.getItem('symbols').split(',')
    if (symbols.includes(this.state.query)) {
      return true
    }
    else {
      this.setState({
        isInvalid: true,
        errorText: 'Not a valid Ticker Symbol. Please try another word',
        query: ''
      })
      return false
    }
  }

  onSearch = (e) => {
    e.preventDefault()
    this.getSymbolData(this.state.query)
  }

  getSymbolData = (symbol) => {
    if (this.state.query != symbol) { this.setState({ query: symbol }) }
    if (this.validateInput()) {
      let arr = this.state.histories
      arr.push(symbol)
      this.setState({histories: arr})
      const param = `?q=${symbol}&token=${process.env.REACT_APP_API_KEY}`
      let response = getSymbol(param)
      let resolved = response.then(res => this.handleSymbol(res.result, symbol))
      let error = resolved.catch(e => {
        if (e) {
          console.log(e)
          this.setState({ isInvalid: true, errorText: "Error. Failed to fetch" })
        }
      })
    }
  }

  handleSymbol = (result, symbolInput) => {
    // if the return result.length == 0
    // then the search word is not valid
    this.setState({ isInvalid: !result.length })
    let rightOne = result.find(e => e.symbol == symbolInput)

    if (result.length) {
      let companyName = rightOne.description
      let symbolName = rightOne.symbol
      this.setState({ showResult: true, companyName, symbolName })
      this.getQuoteData(symbolName)
      this.getGraphData(symbolName)
      this.getSimiliarCompanies(symbolName)
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
    const param = `?symbol=${symbol}&resolution=D&from=${prevTime}&to=${currTime}&token=${process.env.REACT_APP_API_KEY}`
    this.setState({ loadingGraph: true })
    let response = getCandles(param)
    let resolved = response.then(res => {
      if (res.s == "ok") {
        this.setState({ loadingGraph: false })
        this.drawGraphs(res)
      }
    })
    let error = resolved.catch(e => {
      console.log(e)
      this.setState({
        isGraphValid: false,
        loadingGraph: false,
        graphError: "Error: Failed to Fetch"
      })
    })

  }

  getSimiliarCompanies = (symbol) => {
    const param = `?symbol=${symbol}&token=${process.env.REACT_APP_API_KEY}`
    let response = getCompanyPeers(param)
    let resolved = response.then(res => {
      const symbols = localStorage.getItem('symbols').split(',')
      // select three peer comapnies at most
      this.setState({ peers: res.filter(e => symbols.includes(e)).slice(1, 4) })
    })
  }

  drawGraphs = (res) => {
    let dataPoints = []
    for (let i = 0; i < res.t.length; i++) {
      let data = [new Date(res.t[i] * 1000), res.c[i]]
      dataPoints.push(data)
    }
    this.setState({ dataPoints })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.onSearch()
    }
  }

  sortArrayByCount = (arr) => {
    let newset = new Set(arr)
    // record the each value along with their frequency
    let frequency = {}
    for(const i of newset){
      let currArr = arr.filter(e => e == i)
      frequency[i] = currArr.length
    }
    // newArr only have no repeated value
    let newArr = Array.from(newset)
    // sort item of the array based on their appearnce frequency
    return newArr.sort((a, b) => frequency[b] - frequency[a])
  }

  render() {
    const {
      query, currPrice, companyName, symbolName, peers,
      todayhigh, todaylow, todayopen, prevclosed,
      isInvalid, isGraphValid, errorText, graphError, loadingGraph,
      showResult, dataPoints, histories
    } = this.state;

    const histroies_top5 = this.sortArrayByCount(histories).slice(0, 5)

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
            <form className="search-form" onSubmit={this.onSearch}>
              <input className="form-input" type="text" placeholder="TICKER"
                value={query}
                onChange={e => this.setState({ query: e.target.value, showResult: false })} />
              <input className="form-btn" type="submit" value="&#10132;" />
            </form>
            {
              isInvalid
                ? <p>{errorText}</p>
                : showResult &&
                <Result
                  symbolName={symbolName}
                  companyName={companyName}
                  currPrice={currPrice}
                  quoteData={quoteData}
                  peers={peers}
                  histories = {histroies_top5}
                  getSymbolData={this.getSymbolData} />
            }
          </div>
          <hr className="vertical" />
          <div className="graph">
            {
              loadingGraph
                ? <p>Loading graph data...</p>
                : isGraphValid
                  ? dataNotEmpty && <GraphChart dataPoints={dataPoints} />
                  : <p>{graphError}</p>
            }
          </div>
        </div>
      </div>
    );
  }
}


export default App;
