import {QueryKey, useQueryClient} from "@tanstack/react-query";
import {useSnackbar} from "notistack";
import {getErrorMessage} from "../app/utils";

// TODO think how we can optimise it and update react-query by updating state without refetch
/**
 * Simplify handling `onSuccess` and `onError` requests for react-query client
 * providing common approach with request refetch and custom toast messages for
 * mutation requests
 *
 * @param queryKeys
 * @param onSuccess it will be fired after refetch
 */
export function useMutationOptions(queryKeys?: QueryKey[], onSuccess?: (data: any) => void) {
    const {enqueueSnackbar} = useSnackbar()
    const queryClient = useQueryClient();

    return {
        queryClient,
        onSuccess: queryKeys && handleSuccess,
        onError: (error: any) => enqueueSnackbar(getErrorMessage(error), {variant: "error"}),
    }

    async function handleSuccess(data: any) {
        for (const key of queryKeys!!) {
            await queryClient.refetchQueries(key)
        }
        if (onSuccess) onSuccess(data)
    }
}
