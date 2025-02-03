import { ethers } from 'ethers';
import { validateArrowConfig } from '../enviroment';
import { elizaLogger } from '@elizaos/core';

// Pending import missing functions and types from arrow-rfq-sdk once published

export const submitRFQOrder = async (
    runtime: IAgentRuntime,
    position: Position, // TODO: Import from arrow-rfq-sdk once published
    appVersion: AppVersion, // TODO: Import from arrow-rfq-sdk once published
    network: Network // TODO: Import from arrow-rfq-sdk once published
): Promise<{
    executionPrice: null;
    orderId: string;
    transactionBlock: null;
    transactionHash: null;
    transactionStatus: string;
} | null> => {
    try {
        const config = await validateArrowConfig(runtime);
        const privateKey = config.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('Private key not found in environment variables');
        }
        const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
        const signer = new ethers.Wallet(privateKey, provider);
        const transactionDeadline = getCurrentTimeUTC().unixTimestamp + 86400000;

        const isOpeningPosition = [OrderType.OPEN_SHORT, OrderType.OPEN_LONG].includes(
            position.orderType
        );

        const updatedOptionLegs = position.optionLegs.map(optionLeg => {
            return {
                ...optionLeg,
                quantity: optionLeg.quantity,
                strike: Number(optionLeg.strike)
            };
        });

        const preparedOptions: Array<{
            options: Option[];
            positionId?: number;
        }> = [];

        const positionStrategyType = determinePositionStrategyType(updatedOptionLegs);
        if (positionStrategyType === PositionStrategy.CUSTOM) {
            const sortedOption = [...position.optionLegs].sort(
                (leg1, leg2) => leg1.strike - leg2.strike
            );

            preparedOptions.push({
                options: sortedOption,
                positionId: position.positionId
            });
        } else {
            if (
                [
                    PositionStrategy.CALL_CREDIT_SPREAD,
                    PositionStrategy.CALL_DEBIT_SPREAD,
                    PositionStrategy.PUT_CREDIT_SPREAD,
                    PositionStrategy.PUT_DEBIT_SPREAD
                ].includes(positionStrategyType)
            ) {
                preparedOptions.push({
                    options: updatedOptionLegs,
                    positionId: position.positionId
                });
            } else if (
                [
                    PositionStrategy.LONG_CONDOR,
                    PositionStrategy.SHORT_CONDOR,
                    PositionStrategy.LONG_IRON_CONDOR,
                    PositionStrategy.SHORT_IRON_CONDOR
                ].includes(positionStrategyType)
            ) {
                const sortedOption = [...position.optionLegs].sort(
                    (leg1, leg2) => leg1.strike - leg2.strike
                );
                const firstTwoLegs = sortedOption.slice(0, 2);
                const secondTwoLegs = sortedOption.slice(2, 4);
                preparedOptions.push({
                    options: firstTwoLegs,
                    positionId: position.positionId
                });
                preparedOptions.push({
                    options: secondTwoLegs,
                    positionId: position.positionId
                });
            } else {
                preparedOptions.push({
                    options: updatedOptionLegs,
                    positionId: position.positionId
                });
            }
        }

        const getOrderParameters = (
            await import('@shapeshifter-technologies/arrow-rfq-sdk/lib/utils/orders')
        ).getOrderParameters;

        const preparedOrder = await getOrderParameters(
            preparedOptions,
            transactionDeadline,
            isOpeningPosition,
            slippage,
            signer,
            config.NETWORK,
            config.APP_VERSION
        );

        if (isOpeningPosition) {
            const approveSpending = (
                await import('@shapeshifter-technologies/arrow-rfq-sdk/lib/utils/orders')
            ).approveSpending;

            await approveSpending(
                preparedOrder.amountToApprove,
                config.NETWORK,
                getRFQAppVersion(config.APP_VERSION, config.NETWORK),
                signer
            );
        }

        const depositGasFee = (
            await import('@shapeshifter-technologies/arrow-rfq-sdk/lib/utils/orders')
        ).depositGasFee;

        await depositGasFee(config.ADDRESS, config.NETWORK, getRFQAppVersion(config.APP_VERSION, config.NETWORK), signer);

        const submitRFEOrder = (
            await import('@shapeshifter-technologies/arrow-rfq-sdk/lib/utils/orders')
        ).submitRFEOrder;

        const orderSubmission = await submitRFEOrder(
            preparedOrder.preparedParameters,
            config.APP_VERSION,
            config.NETWORK
        );

        return {
            executionPrice: null,
            orderId: orderSubmission.orderId,
            transactionBlock: null,
            transactionHash: null,
            transactionStatus: 'awaiting market maker'
        };
    } catch (error) {
        elizaLogger.error('Failed to submit order:', error);
        return null;
    }
};
