import {TabProps} from "./Overview";
import {Query} from "../../shared/query/Query";
import {QueryType} from "../../../app/types";

export function OverviewActivities(props: TabProps){
    return (
        <Query type={QueryType.ACTIVITY}/>
    )
}