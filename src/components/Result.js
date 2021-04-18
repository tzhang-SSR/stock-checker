export default function Result({ symbolName, companyName, currPrice, quoteData }) {
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
        </div>
    )
}