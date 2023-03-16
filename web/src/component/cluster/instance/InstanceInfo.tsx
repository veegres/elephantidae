import {Box, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {InstanceInfoStatus} from "./InstanceInfoStatus";
import {InstanceInfoTable} from "./InstanceInfoTable";
import {SxPropsMap} from "../../../type/common";
import {Instance, InstanceTabType} from "../../../type/Instance";

const SX: SxPropsMap = {
    info: {display: "flex", flexDirection: "column", gap: 1},
}

type Props = {
    instance: Instance,
    tab: InstanceTabType,
    onTab: (tab: InstanceTabType) => void,
}

export function InstanceInfo(props: Props) {
    const {instance, tab, onTab} = props

    return (
        <Box sx={SX.info}>
            <InstanceInfoStatus role={instance.role}/>
            <ToggleButtonGroup size={"small"} color={"secondary"} fullWidth value={tab}>
                <ToggleButton value={InstanceTabType.CHART} onClick={() => onTab(InstanceTabType.CHART)}>Charts</ToggleButton>
                <ToggleButton value={InstanceTabType.QUERY} onClick={() => onTab(InstanceTabType.QUERY)}>Queries</ToggleButton>
            </ToggleButtonGroup>
            <InstanceInfoTable instance={instance}/>
        </Box>
    )
}
