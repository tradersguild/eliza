import { AgentRuntime } from "../../packages/core/dist/index.js";
import { deribitPlugin } from "../plugin-deribit/dist/index.js";

async function main() {
    const runtime = new AgentRuntime({
        modelProvider: "openai",
        agentId: "test-agent",
        character: {
            bio: "Market analyst",
            lore: "Expert in crypto markets"
        },
        databaseAdapter: {
            init: async () => {},
            close: async () => {},
            get: async () => null,
            set: async () => {},
            delete: async () => {},
            getRoom: async () => ({
                id: "test-room",
                name: "Test Room",
                created: new Date().toISOString()
            }),
            createRoom: async () => ({
                id: "test-room",
                name: "Test Room",
                created: new Date().toISOString()
            }),
            getMessages: async () => [],
            addMessage: async () => {},
            updateMessage: async () => {},
            deleteMessage: async () => {},
            getAccountById: async () => ({
                id: "test-user",
                name: "Test User",
                created: new Date().toISOString()
            }),
            createAccount: async () => ({
                id: "test-user",
                name: "Test User",
                created: new Date().toISOString()
            }),
            getParticipantsForAccount: async () => [{
                id: "test-participant",
                accountId: "test-user",
                roomId: "test-room",
                created: new Date().toISOString()
            }],
            createParticipant: async () => ({
                id: "test-participant",
                accountId: "test-user",
                roomId: "test-room",
                created: new Date().toISOString()
            })
        },
        cacheManager: {
            get: async () => null,
            set: async () => {},
            delete: async () => {}
        },
        initialize: async () => {},
        evaluators: [deribitPlugin.evaluators[0]]
    });

    // Initialize the evaluator directly
    const marketAnalysisEvaluator = deribitPlugin.evaluators[0];
    console.log("Loaded evaluator:", marketAnalysisEvaluator.name);

    const message = {
        userId: "test-user",
        roomId: "test-room",
        content: {
            type: "MARKET_DATA",
            data: {
                btc: {
                    perpetual: {
                        mark_price: 65000,
                        index_price: 64900,
                        basis: "0.15%",
                        funding: {
                            current: 0.01,
                            predicted_8h: 0.02
                        },
                        open_interest: 100000,
                        volume_24h: 500000,
                        price_change_24h: "2.5%"
                    }
                },
                eth: {
                    perpetual: {
                        mark_price: 3500,
                        index_price: 3490,
                        basis: "0.2%",
                        funding: {
                            current: 0.015,
                            predicted_8h: 0.025
                        },
                        open_interest: 50000,
                        volume_24h: 250000,
                        price_change_24h: "3.2%"
                    }
                }
            }
        }
    };

    // Test validation
    const isValid = await marketAnalysisEvaluator.validate(runtime, message);
    console.log("Message validation result:", isValid);

    // Test handler directly
    const result = await marketAnalysisEvaluator.handler(runtime, message, {
        bio: "Market analyst",
        lore: "Expert in crypto markets",
        messageDirections: '',
        postDirections: '',
        style: [],
        topics: [],
        adjectives: [],
        examples: [],
        roomId: "test-room",
        actors: '',
        recentMessages: '',
        recentMessagesData: []
    });

    console.log("Market Analysis Result:", result);
}

main().catch(console.error);