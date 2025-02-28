// TODO: Implement services
// These are the services that will be used by the actions
// They will be responsible for fetching data from the Arrow API
// and returning it in a format that is easy to use by the actions

import { ARROW_RFQ_API_URL } from "./constants";
import { OpenInterestResponse, volumeReponse } from "./types";

export const createArrowService = () => {
    const getVolume = async (): Promise<volumeReponse> => {

        try {
            const url = ARROW_RFQ_API_URL + "/admin/volume"
            const response = await fetch(url);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Arrow API Error:", error.message);
            throw error;
        }
    };

    const getOpenInterest = async (): Promise<OpenInterestResponse> => {
        try {
            const url = ARROW_RFQ_API_URL + "/admin/open-interest"
            const response = await fetch(url);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;

        } catch (error: any)
        {
            console.error("Arrow API Error:", error.message);
            throw error;
        }
    }

    return { getVolume, getOpenInterest };
};
