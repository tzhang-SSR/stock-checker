import './App.css';
import React, { Component } from 'react';
import { getSymbol, getQuotes } from './utils/api';
import Result from './components/Result'
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
    errorText: ''
  }

  onSearch = () => {
    const param = `?q=${this.state.query}&token=${process.env.REACT_APP_API_KEY}`
    let response = getSymbol(param)
    let resolved = response.then(res => this.checkResult(res.result))
    let error = resolved.catch(e => {
      if(e){
        console.log(e)
        this.setState({ isInvalid: true, errorText: "E" })
      }
    })
  }

  checkResult = (result) => {
    console.log("result", result)
    // if result.length == 0 then the search word is not valid
    this.setState({ isInvalid: !result.length })
    if (result.length) {
      let companyName = result[0].description
      let symbolName = result[0].symbol
      this.setState({ showResult: true, companyName, symbolName })
      this.getQuoteData(symbolName)
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

  render() {
    const {
      query, currPrice, companyName, symbolName,
      todayhigh, todaylow, todayopen, prevclosed,
      showResult, isInvalid, errorText
    } = this.state
    const quoteData = [
      { labelName: 'Previous Close: ', labelNum: prevclosed },
      { labelName: 'Todays Open: ', labelNum: todayopen },
      { labelName: 'Todays High: ', labelNum: todayhigh },
      { labelName: 'Todays Low: ', labelNum: todaylow }
    ]
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
                : showResult && <Result
                  symbolName={symbolName}
                  companyName={companyName}
                  currPrice={currPrice}
                  quoteData={quoteData} />
            }
          </div>
          <div className="graph"></div>
        </div>
      </div>
    );
  }
}


export default App;
