import { DeribitClientInterface } from './dist/client.js';
import { MarketDataService } from './dist/service.js';

async function testMarketService() {
    console.log("🧪 Testing Deribit Market Service...\n");

    // Mock runtime for testing
    const mockRuntime = {
        agentId: "test-agent",
        character: {
            clientConfig: {
                deribit: {
                    interval: 3600000,
                    thresholds: {
                        fundingChange: 0.02,
                        priceChange: 0.05
                    }
                }
            }
        },
        clients: {},
        evaluate: async (memory) => {
            console.log("\n📊 Would tweet:", {
                type: memory.content.type,
                text: memory.content.text,
                marketData: {
                    btc: {
                        price: memory.content.data.btc.perpetual.mark_price,
                        basis: memory.content.data.btc.perpetual.basis,
                        funding: memory.content.data.btc.funding.current,
                        pcRatio: memory.content.data.btc.options.put_call_ratio
                    },
                    eth: {
                        price: memory.content.data.eth.perpetual.mark_price,
                        basis: memory.content.data.eth.perpetual.basis,
                        funding: memory.content.data.eth.funding.current,
                        pcRatio: memory.content.data.eth.options.put_call_ratio
                    }
                }
            });
        }
    };

    try {
        // Test 1: Initial Market Tweet
        console.log("Test 1: Initial Market Tweet");
        const client = new DeribitClientInterface(mockRuntime);
        mockRuntime.clients.deribit = client;
        await client.start(mockRuntime);

        const service = new MarketDataService();
        await service.initialize(mockRuntime);
        console.log("✅ Initial market tweet test complete\n");

        // Test 2: Manual Market Tweet
        console.log("Test 2: Manual Market Tweet");
        await service.manualMarketTweet();
        console.log("✅ Manual market tweet test complete\n");

        // Test 3: Rate Limiting
        console.log("Test 3: Rate Limiting");
        console.log("Testing multiple tweets within rate limit period...");
        for (let i = 0; i < 3; i++) {
            console.log(`\nAttempt ${i + 1}:`);
            await service.manualMarketTweet();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log("✅ Rate limiting test complete");

    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

// Run tests
console.log("Starting Deribit Market Service Tests...\n");
testMarketService().then(() => {
    console.log("\n✨ All tests complete!");
}).catch(error => {
    console.error("❌ Tests failed:", error);
    process.exit(1);
});