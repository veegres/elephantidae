import {ReactNode} from "react";
import {ColorsMap, Sidecar} from "./common";
import {Instance, InstanceMap} from "./Instance";

export interface ActiveCluster {
    cluster: Cluster,
    defaultInstance: Instance,
    combinedInstanceMap: InstanceMap,
    warning: boolean,
    detection: DetectionType,
}

export interface Cluster {
    name: string,
    certs: Certs,
    credentials: Credentials,
    instances: Sidecar[],
    tags?: string[],
}

export interface Certs {
    clientCAId?: string,
    clientCertId?: string,
    clientKeyId?: string,
}

export interface Credentials {
    patroniId?: string,
    postgresId?: string,
}

export interface ClusterMap {
    [name: string]: Cluster,
}

export interface ClusterTabs {
    [key: number]: {
        label: string,
        body: (cluster: ActiveCluster) => ReactNode,
        info?: ReactNode,
    }
}

export type DetectionType = "auto" | "manual"

export interface InstanceDetection {
    defaultInstance: Instance,
    combinedInstanceMap: InstanceMap,
    detection: DetectionType,
    warning: boolean,
    colors: ColorsMap,
    fetching: boolean,
    active: boolean,
    refetch: () => void,
}

