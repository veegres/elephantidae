import {Box, Chip, Tooltip} from "@mui/material";
import {RefreshIconButton} from "../../view/IconButtons";
import {Cluster, InstanceDetection, SxPropsMap} from "../../../app/types";
import {grey, orange, purple} from "@mui/material/colors";
import {getDomain, InstanceColor} from "../../../app/utils";
import {InfoTitle} from "../../view/InfoTitle";
import {useStore} from "../../../provider/StoreProvider";
import {useEffect} from "react";

const SX: SxPropsMap = {
    chip: {width: "100%"},
    clusterName: {display: "flex", justifyContent: "center", alignItems: "center", gap: "3px"}
}

type Props = {
    cluster: Cluster,
    instanceDetection: InstanceDetection,
}

export function ListCellChip(props: Props) {
    const {cluster, instanceDetection} = props
    const {defaultInstance, combinedInstanceMap, warning, fetching, refetch} = instanceDetection

    const {isClusterActive, setCluster, setInstance, store} = useStore()
    const detection = store.activeCluster?.detection ?? "auto"
    const isActive = isClusterActive(cluster.name)

    // we ignore this line cause this effect uses setCluster
    // which are always changing in during store update, and it causes endless recursion
    // eslint-disable-next-line
    useEffect(handleEffectDestroy, [])

    return (
        <Box sx={SX.clusterName}>
            <Tooltip title={renderChipTooltip()} placement={"right-start"} arrow disableInteractive>
                <Chip
                    sx={SX.chip}
                    color={isActive ? "primary" : "default"}
                    label={cluster.name}
                    onClick={handleClick}
                />
            </Tooltip>
            <RefreshIconButton loading={fetching} onClick={refetch}/>
        </Box>
    )

    function renderChipTooltip() {
        const items = [
            {label: "Detection", value: detection, bgColor: purple[400]},
            {label: "Instance", value: getDomain(defaultInstance.sidecar), bgColor: InstanceColor[defaultInstance.role]},
            {label: "Warning", value: warning ? "Yes" : "No", bgColor: warning ? orange[500] : grey[500]}
        ]

        return <InfoTitle items={items}/>
    }

    function handleClick() {
        if (isActive) {
            setInstance(undefined)
            setCluster(undefined)

        } else {
            setInstance(undefined)
            setCluster({cluster, defaultInstance, combinedInstanceMap, warning, detection})
        }
    }

    function handleEffectDestroy() {
        return () => setCluster(undefined)
    }
}
