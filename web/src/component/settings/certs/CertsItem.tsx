import {Box, Tooltip} from "@mui/material";
import React from "react";
import {Cert, Style} from "../../../app/types";
import {useTheme} from "../../../provider/ThemeProvider";
import {DeleteIconButton} from "../../view/IconButtons";
import {useMutation} from "@tanstack/react-query";
import {certApi} from "../../../app/api";
import {useMutationOptions} from "../../../hook/QueryCustom";
import {FileUsageOptions} from "../../../app/utils";

const SX = {
    item: { display: "flex", alignItems: "center", padding: "5px 10px", margin: "5px 10px", borderRadius: "5px", gap: 2 },
    body: { flexGrow: 1, display: "flex", gap: 2 },
    name: { flexBasis: "150px" },
    path: { flexBasis: "400px", fontSize: "13px" },
}


const style: Style = {
    break: {textOverflow: "ellipsis", whiteSpace: 'nowrap', overflow: "hidden"},
}


type Props = {
    cert: Cert,
    uuid: string,
}

export function CertsItem(props: Props) {
    const { cert, uuid } = props
    const { info } = useTheme()

    const deleteOptions = useMutationOptions(["certs"])
    const deleteCert = useMutation(certApi.delete, deleteOptions)

    const fileUsage = FileUsageOptions[cert.fileUsageType]

    return (
        <Box sx={{...SX.item, border: `1px solid ${info?.palette.divider}`}}>
            <Tooltip placement={"top"} title={fileUsage.label}>
                {fileUsage.icon}
            </Tooltip>
            <Tooltip placement={"top-start"} title={cert.fileName}>
                <Box sx={SX.name} style={style.break}>{cert.fileName}</Box>
            </Tooltip>
            <Tooltip placement={"top-start"} title={cert.path}>
                <Box sx={{...SX.path, color: info?.palette.text.disabled}} style={style.break}>{cert.path}</Box>
            </Tooltip>
            <DeleteIconButton loading={deleteCert.isLoading} onClick={() => deleteCert.mutate(uuid)} />
        </Box>
    )
}