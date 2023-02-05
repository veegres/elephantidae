import {Alert, Box, TextField} from "@mui/material";
import React, {useState} from "react";
import {useMutationOptions} from "../../../hook/QueryCustom";
import {useMutation} from "@tanstack/react-query";
import {certApi} from "../../../app/api";
import {CertTypeProps} from "./CertsContent";
import {CheckCircle} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";

const SX = {
    box: { display: "flex", flexDirection: "column", padding: "5px", justifyContent: "space-between", height: "100%" },
    form: { display: "flex", alignItems: "center", gap: 1 },
    textField: { flexGrow: 1 },
    alert: { padding: "0 14px", borderRadius: "15px" },
    border: { borderRadius: "15px" },
}

export function CertsTabPath(props: CertTypeProps) {
    const { type } = props
    const [path, setPath] = useState("")

    const addOptions = useMutationOptions(["certs"], () => setPath(""))
    const add = useMutation(certApi.add, addOptions)

    return (
        <Box sx={SX.box}>
            <Alert sx={SX.alert} variant={"outlined"} severity={"info"} icon={false}>
                Ivory can work with files inside the container.
                Keep in mind that you need to mount the folder to the container for it to work.
            </Alert>
            <Box sx={SX.form}>
                <TextField
                    sx={SX.textField}
                    size={"small"}
                    label={"Path to The File"}
                    InputProps={{sx: SX.border}}
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                />
                <LoadingButton
                    sx={SX.border}
                    variant={"outlined"}
                    loading={add.isLoading}
                    onClick={() => add.mutate({ path, type })}
                    disabled={!path}
                    size={"large"}
                >
                    <CheckCircle/>
                </LoadingButton>
            </Box>
        </Box>
    )
}