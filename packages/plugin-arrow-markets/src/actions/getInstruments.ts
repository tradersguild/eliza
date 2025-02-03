import { Action, ActionExample, Handler, IAgentRuntime } from "@elizaos/core";
import { ArrowMarketsProvider } from "../providers/ArrowMarketsProvider";
import { Ticker } from "@shapeshifter-technologies/arrow-rfq-sdk/lib/common/types/option";
import { AppVersion } from "@shapeshifter-technologies/arrow-rfq-sdk/lib/types/general";
import { Network } from "@shapeshifter-technologies/arrow-rfq-sdk/lib/common/types/general";

export class GetInstrumentsAction implements Action {
    private provider: ArrowMarketsProvider;

    public name = "getInstruments";
    public description =
        "Get available trading instruments and their strike grids";
    public examples: ActionExample[][] = [
        [
            {
                content: { text: "List available instruments" },
                user: "user",
            },
        ],
    ];
    public similes = ["list", "instruments", "markets", "options"];
    public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
        return this.execute(params);
    };

    public validate = async (params: any): Promise<boolean> => {
        if (!params.ticker) {
            return false;
        }
        return true;
    };

    async execute(params: {
        ticker?: Ticker;
        appVersion?: AppVersion;
        networkVersion?: Network;
    }) {
        try {
            const instruments = await this.provider.getInstruments(
                params.ticker
            );

            return {
                success: true,
                data: instruments,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error?.message || "Unknown error",
            };
        }
    }
}
