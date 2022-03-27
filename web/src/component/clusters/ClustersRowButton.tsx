import {cloneElement, ReactElement} from "react";
import {CircularProgress, IconButton, Tooltip} from "@mui/material";

const SX = {
    icon: { fontSize: 18 },
    button: { height: '32px', width: '32px' },
}

type Props = {
    icon: ReactElement,
    loading: boolean,
    onClick: () => void,
    tooltip: string
    disabled?: boolean,
}

export function ClustersRowButton({ loading, icon, onClick, tooltip, disabled = false }: Props) {
    return (
        <Tooltip title={tooltip} placement="top" disableInteractive>
            <span>
                <IconButton sx={SX.button} disabled={loading || disabled} onClick={onClick}>
                    {loading ? <CircularProgress size={SX.icon.fontSize}/> : cloneElement(icon, {sx: SX.icon})}
                </IconButton>
            </span>
        </Tooltip>
    )
}
