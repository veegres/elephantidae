import ReactJson from "react-json-view";
import {Box, Skeleton} from "@mui/material";
import {nodeApi} from "../../app/api";
import { useQuery } from "react-query";
import {useTheme} from "../../provider/ThemeProvider";
import {Error} from "../view/Error";
import React from "react";
import {AxiosError} from "axios";

export function NodeConfig({ node }: { node: string }) {
    const theme = useTheme();
    const { data: nodeConfig, isLoading, isError, error } = useQuery(['node/config', node], () => nodeApi.config(node))
    if (isError) return <Error error={error as AxiosError} />

    return (
        <Box>
            {isLoading ?
                <Skeleton variant="rectangular" height={300} /> :
                <ReactJson
                    style={{ backgroundColor: 'inherit' }}
                    src={nodeConfig}
                    collapsed={2}
                    iconStyle="square"
                    displayDataTypes={false}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onAdd={() => {}}
                    theme={theme.mode === 'dark' ? 'apathy' : 'apathy:inverted'}
                />
            }
        </Box>
     )
}
