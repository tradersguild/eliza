import { Action, ActionExample, Handler, IAgentRuntime } from "@elizaos/core";
import { createArrowService } from "../services";

export class GetOpenInterestAction implements Action {
    private arrowService = createArrowService();

    public name = "getOpenInterest";
    public description = "Get the open interest data from Arrow Markets";
    public examples: ActionExample[][] = [
        [
            {
                content: { text: "Get open interest data" },
                user: "user",
            },
        ],
    ];
    public similes = ["open interest", "OI", "positions"];
    
    public handler: Handler = async (runtime: IAgentRuntime) => {
        return this.execute();
    };

    public validate = async (): Promise<boolean> => {
        return true;
    };

    async execute() {
        try {
            const openInterestData = await this.arrowService.getOpenInterest();
            return {
                success: true,
                data: openInterestData,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error?.message || "Unknown error",
            };
        }
    }
}
