import {Box, Tooltip} from "@mui/material";
import {AlertDialog} from "../dialog/AlertDialog";
import {LoadingButton} from "@mui/lab";
import {ReactNode, useState} from "react";
import {SxPropsMap} from "../../../type/general";

const SX: SxPropsMap = {
    button: {minWidth: "10px", textWrap: "nowrap"},
}

type Props = {
    children?: ReactNode,
    label: ReactNode,
    title: string,
    description: ReactNode | string,
    onClick?: () => void,
    tooltip?: string,
    loading?: boolean,
    disabled?: boolean,
    size?: "small" | "medium" | "large",
    color?: "secondary" | "success" | "inherit" | "warning" | "error" | "primary" | "info",
    variant?: "text" | "outlined" | "contained",
}

export function AlertButton(props: Props) {
    const {children, title, description, label, variant, onClick} = props
    const {loading, disabled, size, color, tooltip} = props
    const [open, setOpen] = useState(false)

    return (
        <Box>
            <AlertDialog
                open={open}
                title={title}
                description={description}
                onAgree={onClick}
                onClose={() => setOpen(false)}
            >
                {children}
            </AlertDialog>
            <Tooltip title={tooltip} placement={"top"} arrow={true}>
                <Box component={"span"}>
                    <LoadingButton
                        sx={SX.button}
                        size={size}
                        color={color}
                        variant={variant}
                        disabled={disabled}
                        loading={loading}
                        onClick={() => setOpen(true)}
                    >
                        {label}
                    </LoadingButton>
                </Box>
            </Tooltip>
        </Box>
    )
}
