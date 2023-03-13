import {Database, Sidecar} from "./common";
import {ReactNode} from "react";

export interface ActiveInstance {
    cluster: string,
    sidecar: Sidecar,
    database: Database,
}

export interface InstanceTabs {
    [key: number]: {
        label: string,
        body: (cluster: string, db: Database, show?: boolean) => ReactNode,
        info?: ReactNode,
    }
}


export interface InstanceRequest {
    cluster: string,
    host: string,
    port: number,
    body?: any,
}

export interface InstanceInfo {
    state: string,
    role: string,
    sidecar: Sidecar,
}


export interface Instance {
    state: string,
    role: string,
    lag: number,
    database: Database,
    sidecar: Sidecar,
}

export interface DefaultInstance extends Instance {
    leader: boolean,
    inCluster: boolean,
    inInstances: boolean,
}

export interface InstanceMap {
    [instance: string]: DefaultInstance,
}
