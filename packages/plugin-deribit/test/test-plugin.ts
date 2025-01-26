import { deribitPlugin } from "../src";
import { DeribitClient } from "@elizaos/client-deribit";
import { IAgentRuntime, UUID, State } from "@elizaos/core";

async function testPlugin() {
    console.log("Testing Deribit Plugin...");

    const mockRuntime = {
        agentId: "test-agent" as UUID,
        evaluate: async (message: any, state: any) => {
            console.log("Evaluating message:", {
                type: message.content.type,
                data: message.content.data
            });
            return ["Analysis complete"];
        }
    };

    const mockState: State = {
        bio: "Test bio",
        lore: "Test lore",
        messageDirections: '',
        postDirections: '',
        style: [],
        topics: [],
        adjectives: [],
        examples: [],
        roomId: "test-room" as UUID,
        actors: '',
        recentMessages: '',
        recentMessagesData: []
    };

    try {
        // Test client
        const client = new DeribitClient();
        await client.start(mockRuntime as any);
        const marketData = await client.getMarketData();
        console.log("Market Data:", marketData);

        // Test evaluator
        const message = {
            userId: "test-user" as UUID,
            agentId: "test-agent" as UUID,
            roomId: "test-room" as UUID,
            content: {
                type: "MARKET_DATA",
                text: "Market update",
                data: marketData
            }
        };

        const result = await deribitPlugin.evaluators?.[0].handler(
            mockRuntime as any,
            message as any,
            mockState
        );
        console.log("Evaluation result:", result);

        await client.stop(mockRuntime as any);
        console.log("Test complete!");
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testPlugin();