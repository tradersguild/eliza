import { Action, ActionExample, Handler, IAgentRuntime } from "@elizaos/core";
import { createArrowService } from "../services";

export class GetVolumeAction implements Action {
    private arrowService = createArrowService();

    public name = "getVolume";
    public description = "Get the trading volume statistics from Arrow Markets";
    public examples: ActionExample[][] = [
        [
            {
                content: { text: "Get trading volume" },
                user: "user",
            },
        ],
    ];
    public similes = ["volume", "trading volume", "stats"];
    
    public handler: Handler = async (runtime: IAgentRuntime) => {
        return this.execute();
    };

    public validate = async (): Promise<boolean> => {
        return true;
    };

    async execute() {
        try {
            const volumeData = await this.arrowService.getVolume();
            return {
                success: true,
                data: volumeData,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error?.message || "Unknown error",
            };
        }
    }
}
