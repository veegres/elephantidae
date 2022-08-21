import {Autocomplete, Stack, TextField} from "@mui/material";
import React from "react";
import {CredentialType} from "../../app/types";
import {ClusterSettingsPassword} from "./ClusterSettingsPassword";
import {TabProps} from "./Cluster";
import {ClusterSettingsInstance} from "./ClusterSettingsInstance";

const SX = {
    settings: { width: "250px", gap: 1 }
}

export function ClusterSettings({info}: TabProps) {
    const { instances, instance, cluster } = info

    const passPostgres = cluster.postgresCredId ?? ""
    const passPatroni = cluster.patroniCredId ?? ""

    return (
        <Stack sx={SX.settings}>
            <ClusterSettingsInstance instance={instance.api_domain} instances={instances} />
            <ClusterSettingsPassword label={"Postgres Password"} type={CredentialType.POSTGRES} pass={passPostgres} />
            <ClusterSettingsPassword label={"Patroni Password"} type={CredentialType.PATRONI} pass={passPatroni} />
            <Autocomplete
                value={cluster.certsId}
                options={[]}
                disabled={true}
                renderInput={(params) => <TextField {...params} size={"small"} label={"Patroni Certs (coming soon)"} />}
            />
            <Autocomplete
                multiple
                options={[]}
                disabled={true}
                renderInput={(params) => <TextField {...params} size={"small"} label={"Tags (coming soon)"} />}
            />
        </Stack>
    )
}
