import {CircularProgress, Grid, IconButton, Skeleton, Tooltip} from "@mui/material";
import {nodeApi} from "../../app/api";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useTheme} from "../../provider/ThemeProvider";
import {Error} from "../view/Error";
import React, {ReactElement, useState} from "react";
import {AxiosError} from "axios";
import ReactCodeMirror, {EditorView} from "@uiw/react-codemirror";
import {json} from "@codemirror/lang-json";
import {Cancel, CopyAll, Edit, SaveAlt} from "@mui/icons-material";
import {oneDarkHighlightStyle} from "@codemirror/theme-one-dark";
import {syntaxHighlighting, defaultHighlightStyle} from "@codemirror/language";

const highlightExtension = {
    dark: syntaxHighlighting(oneDarkHighlightStyle),
    light: syntaxHighlighting(defaultHighlightStyle)
}

type Props = { node: string }

export function ClusterConfig({node}: Props) {
    const theme = useTheme();
    const [isEditable, setIsEditable] = useState(false)
    const [configState, setConfigState] = useState('')

    const queryClient = useQueryClient();
    const {data: config, isLoading, isError, error} = useQuery(['node/config', node], () => nodeApi.config(node))
    const updateConfig = useMutation(nodeApi.updateConfig, {
        onSuccess: async () => await queryClient.refetchQueries('node/config')
    })

    if (isError) return <Error error={error as AxiosError}/>
    if (isLoading) return <Skeleton variant="rectangular" height={300}/>

    const isDark = theme.mode === "dark"
    const codeMirrorTheme = EditorView.theme({}, {dark: isDark})
    return (
        <Grid container flexWrap={"nowrap"}>
            <Grid item flexGrow={1}>
                <ReactCodeMirror
                    value={stringify(config)}
                    theme={codeMirrorTheme}
                    editable={isEditable}
                    extensions={[json(), isDark ? highlightExtension.dark : highlightExtension.light]}
                    onChange={(value) => setConfigState(value)}
                />
            </Grid>
            <Grid item xs={"auto"} display={"flex"} flexDirection={"column"}>
                {renderUpdateButtons()}
                {renderButton(<CopyAll/>, "Copy", handleCopyAll)}
            </Grid>
        </Grid>
    )

    function renderUpdateButtons() {
        if (updateConfig.isLoading) return renderButton(<CircularProgress size={25}/>, "Saving", undefined, true)
        if (!isEditable) return renderButton(<Edit/>, "Edit", () => setIsEditable(true))

        return (
            <>
                {renderButton(<Cancel/>, "Cancel", () => setIsEditable(false))}
                {renderButton(<SaveAlt/>, "Save", () => handleUpdate(node, configState))}
            </>
        )
    }

    function renderButton(icon: ReactElement, tooltip: string, onClick = () => {
    }, disabled = false) {
        return (
            <Tooltip title={tooltip} placement="left" arrow>
                <span>
                    <IconButton onClick={onClick} disabled={disabled}>{icon}</IconButton>
                </span>
            </Tooltip>
        )
    }

    function handleCopyAll() {
        const currentConfig = configState ? configState : stringify(config)
        return navigator.clipboard.writeText(currentConfig)
    }

    function handleUpdate(node: string, config: string) {
        setIsEditable(false)
        if (configState) updateConfig.mutate({node, config})
    }

    function stringify(json?: any) {
        return JSON.stringify(json, null, 2)
    }
}