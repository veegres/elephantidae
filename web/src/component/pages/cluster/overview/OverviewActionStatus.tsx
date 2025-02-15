import {Box} from "@mui/material";
import {EnumOptions, SidecarStatus, SxPropsMap} from "../../../../type/general";
import {SidecarStatusOptions} from "../../../../app/utils";
import {UseMutationResult} from "@tanstack/react-query";
import {InstanceRequest} from "../../../../type/instance";
import {useRouterInstanceActivate, useRouterInstancePause} from "../../../../router/instance";
import {InfoBox, Padding} from "../../../view/box/InfoBox";
import {AlertButton} from "../../../view/button/AlertButton";

const SX: SxPropsMap = {
    box: {display: "flex", alignItems: "center", gap: 1},
}

type Props = {
    cluster: string,
    status: SidecarStatus,
    request: InstanceRequest,
}

export function OverviewActionStatus(props: Props) {
    const {status, cluster, request} = props

    const activate = useRouterInstanceActivate(cluster)
    const pause = useRouterInstancePause(cluster)

    const options = SidecarStatusOptions[status]
    const action: { [key in SidecarStatus]: UseMutationResult<string, any, InstanceRequest, unknown> } = {
        [SidecarStatus.Active]: pause,
        [SidecarStatus.Paused]: activate
    }
    const actionButton: { [key in SidecarStatus]: EnumOptions } = {
        [SidecarStatus.Active]: SidecarStatusOptions.PAUSED,
        [SidecarStatus.Paused]: SidecarStatusOptions.ACTIVE
    }

    return (
        <Box sx={SX.box}>
            <InfoBox padding={Padding.No}>
                <AlertButton
                    size={"small"}
                    color={"inherit"}
                    tooltip={actionButton[status].label}
                    label={options.icon}
                    loading={action[status].isPending}
                    title={`Are you sure that you want to ${actionButton[status].label}`}
                    description={<>This action either active or pause patroni. More info can be
                    found <a href="https://patroni.readthedocs.io/en/latest/pause.html">here</a>.</>}
                    onClick={() => {action[status].mutate(request)}}
                />
            </InfoBox>
            <InfoBox tooltip={"Sidecar Status"}>
                <Box sx={{color: options.color}}>{options.name}</Box>
            </InfoBox>
        </Box>
    )
}
