import {Alert, AlertColor, AlertTitle, Box, Collapse, IconButton, InputLabel} from "@mui/material";
import {useState} from "react";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {AxiosError} from "axios";

type ErrorProps = { error: AxiosError | string }
type GeneralProps = { message: string, type: AlertColor, title?: string, json?: string }
type JsonProps = { json: string }

export function Error({ error }: ErrorProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (typeof error === "string") return <General type={"error"} message={error} />
    if (!error.response) return <General type={"error"} message={"Error is not detected"} />

    const { status, statusText } = error.response
    const title = `Error code: ${status ?? 'Unknown'} (${statusText})`
    if (status >= 400 && status < 500) return <General type={"warning"} message={error.message} title={title} />
    if (status >= 500) return <General type={"error"} message={error.message} title={title} />

    return <General type={"error"} message={error.message} title={title} />

    function General(props: GeneralProps) {
        const { message, type } = props
        return (
            <Alert severity={type} onClick={() => setIsOpen(!isOpen)} action={<Button />}>
                <AlertTitle>{props.title ?? type.toString()}</AlertTitle>
                <Box>Message: {message}</Box>
                {props.json ? <Json json={props.json} /> : null}
            </Alert>
        )
    }

    function Button() {
        return (
            <IconButton color={"inherit"} disableRipple>
                {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
        )
    }

    function Json(props: JsonProps) {
        return (
            <Collapse in={isOpen}>
                <InputLabel sx={{ padding: '10px 0px', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(props.json, null, 4)}
                </InputLabel>
            </Collapse>
        )
    }
}