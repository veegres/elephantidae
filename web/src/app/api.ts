import axios from "axios";
import {Cluster, ClusterMap, CompactTable, Node, NodeOverview, PgCompactTable, Response} from "./types";

const api = axios.create({ baseURL: '/api' })

export const nodeApi = {
    overview: (node: String) => api.get<Response<NodeOverview>>(`/node/${node}/overview`).then((response) => response.data.response),
    cluster: (node: String) => api.get<Response<{ members: Node[] }>>(`/node/${node}/cluster`).then((response) => response.data.response.members),
    config: (node: String) => api.get(`/node/${node}/config`).then((response) => response.data.response),
    updateConfig: ({node, config}: { node: string, config: string }) => api.patch(`/node/${node}/config`, config)
        .then((response) => response.data.response),
    switchover: ({node, leader, candidate}: { node: string, leader: string, candidate?: string }) =>
        api.post(`/node/${node}/switchover`, {candidate, leader})
            .then((response) => response.data.response),
    reinitialize: (node: string, force: boolean = true) => api.post(`/node/${node}/reinitialize`, {force: force})
        .then((response) => response.data.response)
}

export const clusterApi = {
    get: (name: string) => api.get<Response<Cluster>>(`/cluster/${name}`)
        .then((response) => response.data.response),
    list: () => api.get<Response<Cluster[]>>(`/cluster`)
        .then((response) => response.data.response.reduce(
            (prev, current) => {
                prev[current.name] = current.nodes;
                return prev
            },
            {} as ClusterMap
        )),
    update: (cluster: Cluster) => api.put<Response<Cluster>>(`/cluster`, cluster)
        .then((response) => response.data.response),
    delete: (name: string) => api.delete(`/cluster/${name}`)
        .then((response) => response.data.response)
}

export const cliApi = {
    pgcompacttable: (pgCompactTable: PgCompactTable) => api.post<Response<CompactTable>>(`/cli/pgcompacttable`, pgCompactTable)
        .then((response) => response.data.response),
}
