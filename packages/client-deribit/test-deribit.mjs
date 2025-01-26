import fetch from 'node-fetch';

async function testDeribitAPI() {
    console.log("Testing Deribit API...");
    const baseUrl = 'https://www.deribit.com/api/v2';
    const assets = ['BTC', 'ETH', 'SOL'];

    for (const asset of assets) {
        console.log(`\n=== ${asset} Market Analysis ===`);

        try {
            // Fetch perpetual data
            const perpResponse = await fetch(`${baseUrl}/public/ticker?instrument_name=${asset}-PERPETUAL`);
            const perpData = await perpResponse.json();

            // Fetch options chain
            const optionsResponse = await fetch(`${baseUrl}/public/get_book_summary_by_currency?currency=${asset}&kind=option`);
            const optionsData = await optionsResponse.json();

            // Get instrument data
            const instrumentResponse = await fetch(`${baseUrl}/public/get_instrument?instrument_name=${asset}-PERPETUAL`);
            const instrumentData = await instrumentResponse.json();

            // Calculate key metrics
            const optionsOI = optionsData.result.reduce((sum, opt) => sum + (opt.open_interest || 0), 0);
            const putCallRatio = optionsData.result.reduce((ratio, opt) => {
                if (opt.instrument_name.includes('-P')) ratio.puts += opt.open_interest || 0;
                if (opt.instrument_name.includes('-C')) ratio.calls += opt.open_interest || 0;
                return ratio;
            }, { puts: 0, calls: 0 });

            console.log({
                perpetual: {
                    mark_price: perpData.result.mark_price,
                    index_price: perpData.result.index_price,
                    basis: ((perpData.result.mark_price / perpData.result.index_price - 1) * 100).toFixed(4) + '%',
                    funding: {
                        current: perpData.result.current_funding,
                        predicted_8h: perpData.result.funding_8h
                    },
                    open_interest: perpData.result.open_interest,
                    volume_24h: perpData.result.stats.volume,
                    price_change_24h: perpData.result.stats.price_change + '%'
                },
                options: {
                    total_open_interest: optionsOI,
                    put_call_ratio: (putCallRatio.puts / putCallRatio.calls).toFixed(3),
                    active_strikes: optionsData.result.length,
                    puts_oi: putCallRatio.puts,
                    calls_oi: putCallRatio.calls
                },
                market_depth: {
                    best_bid: perpData.result.best_bid_price,
                    best_ask: perpData.result.best_ask_price,
                    spread: (perpData.result.best_ask_price - perpData.result.best_bid_price).toFixed(2),
                    bid_size: perpData.result.best_bid_amount,
                    ask_size: perpData.result.best_ask_amount
                },
                timestamp: new Date(perpData.result.timestamp).toISOString()
            });

        } catch (error) {
            console.error(`Error fetching ${asset} data:`, {
                message: error.message,
                stack: error.stack
            });
        }
    }
}

testDeribitAPI().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});