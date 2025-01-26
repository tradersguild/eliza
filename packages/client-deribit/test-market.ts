import fetch from 'node-fetch';

async function testDeribitAPI() {
    console.log("Testing Deribit API...");

    const baseUrl = 'https://www.deribit.com/api/v2';
    const assets = ['BTC', 'ETH', 'SOL'];

    for (const asset of assets) {
        try {
            // Get perpetual data
            const perpResponse = await fetch(`${baseUrl}/public/ticker?instrument_name=${asset}-PERPETUAL`);
            const perpData = await perpResponse.json();

            // Get options data
            const optionsResponse = await fetch(`${baseUrl}/public/get_book_summary_by_currency?currency=${asset}&kind=option`);
            const optionsData = await optionsResponse.json();

            console.log(`\n${asset} Market Data:`, {
                perpetual: {
                    mark_price: perpData.result?.mark_price,
                    index_price: perpData.result?.index_price,
                    funding_rate: perpData.result?.current_funding,
                    funding_8h: perpData.result?.funding_8h
                },
                options: {
                    active_instruments: optionsData.result?.length,
                    put_call_ratio: calculatePutCallRatio(optionsData.result)
                }
            });
        } catch (error) {
            console.error(`Error fetching ${asset} data:`, error);
        }
    }
}

function calculatePutCallRatio(options: any[]) {
    if (!Array.isArray(options)) return 0;

    const totals = options.reduce((acc, opt) => {
        if (opt.instrument_name?.includes('-P')) acc.puts += opt.open_interest || 0;
        if (opt.instrument_name?.includes('-C')) acc.calls += opt.open_interest || 0;
        return acc;
    }, { puts: 0, calls: 0 });

    return totals.calls > 0 ? (totals.puts / totals.calls).toFixed(3) : 0;
}

// Run test
console.log("Starting Deribit Market Data Test...\n");
testDeribitAPI().then(() => {
    console.log("\n✨ Test complete!");
}).catch(error => {
    console.error("❌ Test failed:", error);
    process.exit(1);
});