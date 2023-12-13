import {InputBase} from "@mui/material";
import {useEffect, useState} from "react";
import {Database, SxPropsMap} from "../../../type/common";
import {QueryRequest, QueryType} from "../../../type/query";
import {QueryBody} from "./QueryBody";
import {QueryBodyInfoEdit} from "./QueryBodyInfoEdit";
import {QueryItemWrapper} from "./QueryItemWrapper";

const SX: SxPropsMap = {
    input: {fontSize: "inherit", padding: "0"},
}

type Props = {
    type: QueryType,
    credentialId: string,
    db: Database,
}

export function QueryItemNew(props: Props) {
    const {type, credentialId, db} = props
    const [body, setBody] = useState(false)
    const [queryCreate, setQueryCreate] = useState<QueryRequest>({name: "", query: "", type})

    useEffect(handleEffectClose, [queryCreate.name, setBody]);

    return (
        <QueryItemWrapper
            params={queryCreate.params}
            varieties={queryCreate.varieties}
            credentialId={credentialId}
            db={db}
            type={type}
            renderTitle={renderTitle()}
            edit={"create"}
            editRequest={queryCreate}
            onEditSuccess={handleSuccess}
        >
            <QueryBody show={body}>
                <QueryBodyInfoEdit query={queryCreate} onChange={setQueryCreate}/>
            </QueryBody>
        </QueryItemWrapper>
    )

    function renderTitle() {
        return (
            <InputBase
                sx={SX.input}
                fullWidth
                required
                placeholder={"Type query name"}
                value={queryCreate.name}
                onChange={(e) => setQueryCreate({...queryCreate, name: e.target.value})}
            />
        )
    }

    function handleEffectClose() {
        if (queryCreate.name === "") setBody(false)
        else setBody(true)
    }

    function handleSuccess() {
        setQueryCreate({name: "", query: "", type})
    }
}
