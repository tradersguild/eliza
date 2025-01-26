import { DeribitClientInterface } from './types';
import { DeribitClient } from './client';
import { MarketDataService } from './service';

async function testDeribitIntegration() {
    console.log("Starting Deribit integration test...");

    // Create a mock runtime
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
        evaluate: async (memory: any) => {
            console.log("Runtime would evaluate:", {
                type: memory.content.type,
                data: {
                    btc: {
                        price: memory.content.data.btc.perpetual.price,
                        funding: memory.content.data.btc.funding
                    },
                    eth: {
                        price: memory.content.data.eth.perpetual.price,
                        funding: memory.content.data.eth.funding
                    },
                    sol: {
                        price: memory.content.data.sol.perpetual.price,
                        funding: memory.content.data.sol.funding
                    }
                }
            });
        }
    };

    try {
        // Test client directly
        console.log("\nTesting Deribit Client...");
        const client = new DeribitClient();
        const marketData = await client.getMarketData();
        console.log("Market Data Retrieved:", marketData);

        // Test service
        console.log("\nTesting Market Data Service...");
        const service = new MarketDataService();
        await service.initialize(mockRuntime as any);

        console.log("\nTest complete!");
    } catch (error) {
        console.error("Test failed:", error);
    }
}

// Run the test
testDeribitIntegration();