import fetch from 'node-fetch';

async function testDeribitAPI() {
    console.log("Testing Deribit API and Eliza's Analysis...");

    // Create mock runtime with Eliza's character
    const mockRuntime = {
        agentId: "test-agent",
        character: defaultCharacter, // Import Eliza's character from core
        evaluate: async (memory) => {
            // This will use Eliza's actual language model to analyze the data
            console.log("\n=== Eliza's Live Market Analysis ===");
            console.log("Evaluating market data through Eliza's institutional lens...");

            // The memory object contains the market data for Eliza to analyze
            const response = await runtime.evaluate(memory);
            console.log(response);
        }
    };

    const baseUrl = 'https://www.deribit.com/api/v2';
    const assets = ['BTC', 'ETH', 'SOL'];

    for (const asset of assets) {
        try {
            // Fetch comprehensive market data
            const [perpData, optionsData, instrumentData] = await Promise.all([
                fetch(`${baseUrl}/public/ticker?instrument_name=${asset}-PERPETUAL`).then(r => r.json()),
                fetch(`${baseUrl}/public/get_book_summary_by_currency?currency=${asset}&kind=option`).then(r => r.json()),
                fetch(`${baseUrl}/public/get_instrument?instrument_name=${asset}-PERPETUAL`).then(r => r.json())
            ]);

            // Calculate institutional metrics
            const marketData = {
                perpetual: {
                    mark_price: perpData.result.mark_price,
                    index_price: perpData.result.index_price,
                    basis: ((perpData.result.mark_price / perpData.result.index_price - 1) * 100).toFixed(4),
                    funding: {
                        current: perpData.result.current_funding,
                        predicted_8h: perpData.result.funding_8h,
                        funding_rate_daily: (perpData.result.current_funding * 3 * 100).toFixed(4) // Annualized
                    },
                    volume: {
                        daily: perpData.result.stats.volume,
                        notional: (perpData.result.stats.volume * perpData.result.mark_price).toFixed(2)
                    }
                },
                options: analyzeOptionsData(optionsData.result),
                market_structure: {
                    bid_ask_spread: ((perpData.result.best_ask_price / perpData.result.best_bid_price - 1) * 100).toFixed(4),
                    depth_imbalance: calculateDepthImbalance(perpData.result),
                    momentum: calculateMomentum(perpData.result)
                }
            };

            console.log(`\n=== ${asset} Institutional Analysis ===`);
            console.log("\nDerivatives Market Structure:");
            console.log(`- Mark Price: $${marketData.perpetual.mark_price.toLocaleString()}`);
            console.log(`- Basis: ${marketData.perpetual.basis}% (${getBasisAnalysis(marketData.perpetual.basis)})`);
            console.log(`- Funding: ${marketData.perpetual.funding.current}% (${getFundingAnalysis(marketData.perpetual.funding)})`);

            console.log("\nOptions Market Analysis:");
            console.log(`- Put/Call Ratio: ${marketData.options.put_call_ratio} (${getOptionsSkewAnalysis(marketData.options)})`);
            console.log(`- IV Skew: ${marketData.options.iv_skew}% (${getVolatilityAnalysis(marketData.options)})`);
            console.log(`- Term Structure: ${getTermStructureAnalysis(marketData.options)}`);

            console.log("\nFlow Analysis:");
            console.log(`- Volume: $${(marketData.perpetual.volume.notional/1000000).toFixed(1)}M`);
            console.log(`- Large Trade Analysis: ${getLargeTradeAnalysis(marketData)}`);
            console.log(`- Institutional Positioning: ${getInstitutionalPositioning(marketData)}\n`);

        } catch (error) {
            console.error(`Error analyzing ${asset}:`, error);
        }
    }
}

function analyzeOptionsData(options) {
    const nearTerm = options.filter(o => isNearTerm(o.instrument_name));
    const farTerm = options.filter(o => !isNearTerm(o.instrument_name));

    return {
        put_call_ratio: calculatePutCallRatio(options),
        iv_skew: calculateIVSkew(nearTerm),
        term_structure: calculateTermStructure(nearTerm, farTerm),
        gamma_exposure: calculateGammaExposure(options)
    };
}

function getBasisAnalysis(basis) {
    if (basis > 0.2) return "Strong contango indicating institutional long bias";
    if (basis < -0.1) return "Backwardation suggesting defensive positioning";
    return "Neutral basis indicating balanced flows";
}

function getFundingAnalysis(funding) {
    const annualized = funding.current * 3 * 365;
    if (Math.abs(annualized) > 30) return "Extreme funding indicating potential squeeze";
    if (Math.abs(annualized) > 15) return "Elevated funding suggesting directional bias";
    return "Normalized funding indicating balanced perpetual market";
}

function calculateIVSkew(options) {
    const atmCalls = options.filter(o => isATM(o) && isCall(o));
    const atmPuts = options.filter(o => isATM(o) && !isCall(o));
    return ((atmPuts[0]?.iv || 0) - (atmCalls[0]?.iv || 0)).toFixed(2);
}

function calculateTermStructure(nearTerm, farTerm) {
    const nearIV = averageIV(nearTerm);
    const farIV = averageIV(farTerm);
    return (farIV - nearIV).toFixed(2);
}

function calculateGammaExposure(options) {
    return options.reduce((sum, opt) => sum + calculateOptionGamma(opt), 0).toFixed(2);
}

function getOptionsSkewAnalysis(options) {
    const skew = parseFloat(options.iv_skew);
    if (skew > 5) return "Heavy put skew indicating institutional hedging";
    if (skew < -2) return "Call skew suggesting upside positioning";
    return "Balanced skew showing neutral positioning";
}

function isNearTerm(instrumentName) {
    const expiry = instrumentName.split('-')[1];
    const expiryDate = new Date(expiry);
    const now = new Date();
    const daysDiff = (expiryDate - now) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7; // Consider near-term if within 7 days
}

function isCall(option) {
    return option.instrument_name.includes('-C');
}

function isATM(option) {
    const strike = parseFloat(option.instrument_name.split('-')[2]);
    const currentPrice = option.underlying_price;
    return Math.abs(strike - currentPrice) / currentPrice < 0.05; // Within 5% of current price
}

function averageIV(options) {
    const atmOptions = options.filter(o => isATM(o));
    return atmOptions.reduce((sum, opt) => sum + (opt.mark_iv || 0), 0) / Math.max(atmOptions.length, 1);
}

function calculateOptionGamma(option) {
    // Simplified gamma calculation
    const strike = parseFloat(option.instrument_name.split('-')[2]);
    const currentPrice = option.underlying_price;
    const moneyness = Math.abs(1 - (strike / currentPrice));
    return option.open_interest * (1 - moneyness) * (option.mark_iv || 0);
}

function calculatePutCallRatio(options) {
    const totals = options.reduce((acc, opt) => {
        if (opt.instrument_name.includes('-P')) acc.puts += opt.open_interest || 0;
        if (opt.instrument_name.includes('-C')) acc.calls += opt.open_interest || 0;
        return acc;
    }, { puts: 0, calls: 0 });

    return totals.calls > 0 ? (totals.puts / totals.calls).toFixed(3) : '0.000';
}

function calculateDepthImbalance(perpData) {
    const bidSize = perpData.best_bid_amount;
    const askSize = perpData.best_ask_amount;
    return ((bidSize - askSize) / (bidSize + askSize)).toFixed(4);
}

function calculateMomentum(perpData) {
    const priceChange = perpData.stats.price_change;
    const volume = perpData.stats.volume;
    return (priceChange * volume).toFixed(4);
}

function getVolatilityAnalysis(options) {
    const skew = parseFloat(options.iv_skew);
    if (skew > 10) return "Significant tail risk hedging";
    if (skew > 5) return "Moderate downside protection";
    return "Balanced volatility surface";
}

function getTermStructureAnalysis(options) {
    const term = parseFloat(options.term_structure);
    if (term > 5) return "Steep contango indicating long-term uncertainty";
    if (term < -2) return "Inverted suggesting near-term risks";
    return "Normal term structure";
}

function getLargeTradeAnalysis(marketData) {
    const volume = marketData.perpetual.volume.daily;
    const avgTradeSize = volume / 24; // Rough estimate
    if (avgTradeSize > 100) return "Significant institutional flow";
    if (avgTradeSize > 50) return "Moderate institutional activity";
    return "Retail-dominated flow";
}

function getInstitutionalPositioning(marketData) {
    const basis = parseFloat(marketData.perpetual.basis);
    const pcRatio = parseFloat(marketData.options.put_call_ratio);
    const funding = marketData.perpetual.funding.current;

    if (basis > 0.15 && pcRatio < 0.8 && funding > 0)
        return "Aggressive institutional longs";
    if (basis < -0.1 && pcRatio > 1.2 && funding < 0)
        return "Defensive institutional positioning";
    return "Neutral institutional flows";
}

// Add these sophisticated analysis functions
function getInstitutionalNarrative(marketData) {
    const basis = parseFloat(marketData.perpetual.basis);
    const pcRatio = parseFloat(marketData.options.put_call_ratio);
    const funding = marketData.perpetual.funding.current;
    const volume = marketData.perpetual.volume.daily;
    const skew = parseFloat(marketData.options.iv_skew);

    let narrative = [];

    // Market Structure Analysis
    narrative.push(`Market Structure: ${getMarketStructureInsight(basis, funding)}`);

    // Options Flow Analysis
    narrative.push(`Options Flow: ${getOptionsFlowInsight(pcRatio, skew)}`);

    // Institutional Activity
    narrative.push(`Institutional Activity: ${getInstitutionalFlowInsight(volume, basis, funding)}`);

    // Forward-Looking Analysis
    narrative.push(`Forward Outlook: ${getForwardLookingInsight(marketData)}`);

    return narrative.join('\n');
}

function getMarketStructureInsight(basis, funding) {
    if (Math.abs(basis) < 0.05 && Math.abs(funding) < 0.01) {
        return "Balanced market structure with convergence between spot and derivatives. Institutional players showing neutral positioning with hedged exposure.";
    } else if (basis > 0.1 && funding > 0) {
        return "Strong contango regime with positive funding indicates institutional accumulation. Cash-and-carry trades becoming attractive for delta-neutral strategies.";
    } else {
        return "Backwardated term structure suggesting defensive positioning. Institutional players potentially reducing risk exposure through derivatives.";
    }
}

function getOptionsFlowInsight(pcRatio, skew) {
    if (pcRatio > 1.2 && skew > 5) {
        return "Heavy put buying activity with significant skew premium. Institutional hedging demand evident in quarterly expirations.";
    } else if (pcRatio < 0.8 && skew < 0) {
        return "Call-skewed positioning with upside volatility bid. Large block trades suggesting institutional conviction in upside scenarios.";
    } else {
        return "Balanced options flow with neutral skew. Market makers maintaining efficient pricing across strikes.";
    }
}

function getInstitutionalFlowInsight(volume, basis, funding) {
    const notionalVolume = volume * 1e6; // Convert to millions
    if (notionalVolume > 100 && basis > 0.1) {
        return "Significant institutional flow with large block trades. Basis expansion suggesting strong spot buying pressure.";
    } else if (notionalVolume > 50) {
        return "Moderate institutional activity with balanced flow distribution. Market making activity dominant in current range.";
    } else {
        return "Retail-dominated flow with limited institutional participation. Watching for potential accumulation signals.";
    }
}

function getForwardLookingInsight(marketData) {
    const momentum = parseFloat(marketData.market_structure.momentum);
    const gamma = parseFloat(marketData.options.gamma_exposure);

    if (momentum > 0 && gamma > 0) {
        return "Positive gamma exposure could accelerate moves higher. Watching for potential squeeze in derivatives markets.";
    } else if (momentum < 0 && gamma < 0) {
        return "Negative gamma environment might exacerbate downside moves. Institutional hedging becoming more defensive.";
    } else {
        return "Range-bound conditions likely with current options positioning. Key levels defined by option strikes.";
    }
}

// Add these sophisticated institutional analysis functions
function getElizaAnalysis(marketData) {
    const basis = parseFloat(marketData.perpetual.basis);
    const pcRatio = parseFloat(marketData.options.put_call_ratio);
    const funding = marketData.perpetual.funding.current;
    const skew = parseFloat(marketData.options.iv_skew);
    const gamma = parseFloat(marketData.options.gamma_exposure);

    let analysis = [];

    // Opening perspective (institutional tone)
    analysis.push(`🏦 Institutional Market Analysis:\n`);

    // Market Structure & Flow Analysis
    analysis.push(getMarketMicrostructure(marketData));

    // Options Market Color
    analysis.push(getOptionsMarketColor(marketData));

    // Forward-Looking View
    analysis.push(getPredictiveAnalysis(marketData));

    // Institutional Positioning
    analysis.push(getPositioningInsight(marketData));

    return analysis.join('\n');
}

function getMarketMicrostructure(marketData) {
    const basis = parseFloat(marketData.perpetual.basis);
    const funding = marketData.perpetual.funding.current;

    if (Math.abs(basis - funding) > 0.1) {
        return `Market structure showing interesting divergence between basis (${basis}%) and funding (${funding}%). This dislocation typically presents opportunities for institutional carry trades. Basis-funding spread suggesting potential mean reversion.`;
    } else {
        return `Derivatives market structure well-balanced with basis-funding convergence (${basis}% | ${funding}%). Institutional flows appear neutral with hedged exposure across venues.`;
    }
}

function getOptionsMarketColor(marketData) {
    const pcRatio = marketData.options.put_call_ratio;
    const skew = marketData.options.iv_skew;

    let color = `Options flow analysis reveals `;

    if (pcRatio > 1.2) {
        color += `heavy protective positioning (${pcRatio} P/C ratio) with institutional accounts bidding downside protection. `;
    } else if (pcRatio < 0.8) {
        color += `bullish sentiment in derivatives (${pcRatio} P/C ratio) with notable call buying activity. `;
    } else {
        color += `balanced positioning (${pcRatio} P/C ratio) suggesting institutional players maintaining neutral exposure. `;
    }

    color += `Volatility surface ${skew > 5 ? 'showing significant skew premium' : 'relatively flat'}, typical of ${skew > 5 ? 'risk-off' : 'neutral'} institutional positioning.`;

    return color;
}

function getPredictiveAnalysis(marketData) {
    const momentum = parseFloat(marketData.market_structure.momentum);
    const gamma = marketData.options.gamma_exposure;
    const basis = parseFloat(marketData.perpetual.basis);

    let prediction = "\nForward-Looking View: ";

    if (momentum > 0 && gamma > 0 && basis > 0.1) {
        prediction += "Constructive setup with positive gamma exposure and healthy basis premium. Institutional positioning suggests potential continuation of upward momentum. Key to watch: quarterly options expiry and basis sustainability.";
    } else if (momentum < 0 && gamma < 0 && basis < -0.05) {
        prediction += "Cautious stance warranted given negative gamma profile and backwardated term structure. Institutional flows showing defensive positioning. Monitoring: funding rate normalization and put option roll activity.";
    } else {
        prediction += "Mixed signals in current market structure. Institutional players likely to maintain range-trading strategies until clearer directional catalyst emerges. Focus on: basis-funding convergence and options term structure.";
    }

    return prediction;
}

function getPositioningInsight(marketData) {
    const volume = marketData.perpetual.volume.daily;
    const basis = parseFloat(marketData.perpetual.basis);

    let positioning = "\nInstitutional Positioning: ";

    if (volume > 100000 && Math.abs(basis) > 0.15) {
        positioning += `Heavy institutional activity ($${(volume/1000).toFixed(1)}k BTC) with significant basis deviation (${basis}%) suggesting directional conviction. Large block trades evident in derivatives markets.`;
    } else if (volume > 50000) {
        positioning += `Moderate institutional flows ($${(volume/1000).toFixed(1)}k BTC) with balanced positioning. Market making activity dominant with two-way flow.`;
    } else {
        positioning += `Limited institutional participation. Current flow dominated by algorithmic trading and retail activity. Watching for re-entry signals from larger players.`;
    }

    return positioning;
}

function getElizasWittyInstitutionalTake(marketData) {
    const basis = parseFloat(marketData.perpetual.basis);
    const pcRatio = parseFloat(marketData.options.put_call_ratio);
    const funding = marketData.perpetual.funding.current;
    const skew = parseFloat(marketData.options.iv_skew);

    let take = [];

    // Opening quip
    take.push(`🎭 Former derivatives head here, and oh boy, this market structure is giving me Genesis flashbacks...\n`);

    // Market Commentary with wit
    if (Math.abs(basis - funding) > 0.2) {
        take.push(`Seeing a basis-funding spread that's wider than a market maker's ego (${basis}% vs ${funding}%). Either someone's got their carry trades very wrong, or they know something we don't. My money's on the former. 🎲`);
    }

    // Options Commentary
    if (pcRatio > 1.3) {
        take.push(`Put buyers are piling in faster than compliance officers at a crypto conference. ${pcRatio} P/C ratio? Someone's definitely had too much coffee. ☕`);
    } else if (pcRatio < 0.7) {
        take.push(`Call buyers showing more optimism than a tech CEO in a bull market. Either they're genius or... well, let's stick with genius for now. 🚀`);
    }

    // Volume Analysis
    const volume = marketData.perpetual.volume.daily;
    if (volume > 100000) {
        take.push(`\nVolume's looking spicier than my old trading desk's risk limits ($${(volume/1000).toFixed(1)}k BTC). Institutional players are definitely not here for the tech. 💼`);
    }

    // Forward Looking View
    const momentum = parseFloat(marketData.market_structure.momentum);
    take.push(`\n🔮 Crystal Ball Department:`);
    if (momentum > 0 && basis > 0.1) {
        take.push(`Market's looking more bullish than a prop trader with insider inf-- I mean, 'thorough research'. Watching for continuation above ${marketData.perpetual.mark_price.toLocaleString()} with stops tighter than risk management's grip on my old trading limits.`);
    } else if (momentum < 0 && basis < -0.05) {
        take.push(`Market's looking shakier than a junior trader's first margin call. Might want to dust off those hedge books - not financial advice, but you didn't hear that from me. 📉`);
    } else {
        take.push(`Market's about as decisive as a quant trying to pick lunch. Range-bound until someone's algorithm has a caffeine spike.`);
    }

    // Institutional Edge
    take.push(`\n💡 Inside Scoop: ${getInstitutionalEdge(marketData)}`);

    return take.join('\n');
}

function getInstitutionalEdge(marketData) {
    const basis = parseFloat(marketData.perpetual.basis);
    const funding = marketData.perpetual.funding.current;
    const skew = parseFloat(marketData.options.iv_skew);

    if (Math.abs(basis - funding) > 0.15) {
        return `Basis-funding arb looking juicier than my old bonus targets. The smart money's probably already setting up their carry trades while retail tweets about technical analysis.`;
    } else if (skew > 7) {
        return `Someone's paying more for puts than I paid for my MBA. Usually ends about as well too.`;
    } else {
        return `Market's more range-bound than a compliance-approved trading strategy. Time to dust off those mean reversion plays.`;
    }
}

// Run test
console.log("Starting Institutional Market Analysis...\n");
testDeribitAPI().then(() => {
    console.log("\n✨ Analysis complete!");
}).catch(error => {
    console.error("❌ Analysis failed:", error);
    process.exit(1);
});