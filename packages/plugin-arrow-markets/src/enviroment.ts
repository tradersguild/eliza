import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const arrowEnvSchema = z.object({
    ARROW_API_URL: z.string().min(1, "Arrow API URL is required"),
    AVALANCHE_MAINNET_PRIVATE_KEYS: z
        .string()
        .min(1, "Avalanche mainnet private keys are required"),
    AVALANCHE_MAINNET_RPC_URL: z
        .string()
        .min(1, "Avalanche mainnet RPC URL is required"),
});

export type ArrowConfig = z.infer<typeof arrowEnvSchema>;

export async function validateArrowConfig(
    runtime: IAgentRuntime
): Promise<ArrowConfig> {
    try {
        const config = {
            ARROW_API_URL: runtime.getSetting("ARROW_API_URL"),
            AVALANCHE_MAINNET_PRIVATE_KEYS: runtime.getSetting(
                "AVALANCHE_MAINNET_PRIVATE_KEYS"
            ),
            AVALANCHE_MAINNET_RPC_URL: runtime.getSetting(
                "AVALANCHE_MAINNET_RPC_URL"
            ),
        };
        console.log("config: ", config);
        return arrowEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error);
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Arrow API configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
