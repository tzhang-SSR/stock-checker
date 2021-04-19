import './result.css';

export default function Result({ symbolName, companyName, currPrice, quoteData, peers, getSymbolData }) {
    return (
        <div className="search-result">
            <div className="result-symbol">{symbolName}</div>
            <div className="result-figures">
                <div>
                    <div className="company">{companyName}</div>
                    <div className="currPrice">{currPrice}</div>
                </div>
                <div className="quoteData">
                    {/*get realy time quotes with given symbol */}
                    {
                        quoteData.map((data, index) =>
                            <div key={index}>
                                <div className="quoteLabel">{data.labelName}</div>
                                <div className="quoteNum">{data.labelNum}</div>
                            </div>)
                    }
                </div>
            </div>
            <div className="result-peers">Similiar Companies</div>
            <div className="result-peersList">{
                peers.map((peer, index) => 
                    <div key={index} onClick={() => getSymbolData(peer)}>{peer}</div>
                )
            }</div>
        </div>
    )
}