import {useState} from "react";
import {StartupBlock} from "./StartupBlock";
import {KeyEnterInput} from "../view/input/KeyEnterInput";
import {Typography} from "@mui/material";
import {EraseButton} from "../shared/erase/EraseButton";
import {StartupSecretButton} from "./StartupSecretButton";
import {useMutationOptions} from "../../hook/QueryCustom";
import {useMutation} from "@tanstack/react-query";
import {initialApi} from "../../app/api";


export function StartupSecondary() {
    const [key, setKey] = useState("")
    const setReqOptions = useMutationOptions([["info"]])
    const setReq = useMutation(initialApi.setSecret, setReqOptions)

    return (
        <StartupBlock header={"Welcome Back"} renderFooter={renderButtons()}>
            <Typography variant={"caption"}>
                Looks like Ivory was rebooted. Please, provide the <b>Secret word</b> to be able
                to continue working with sensitive data.
                You can start from scratch by cleaning the secret word and sensitive data, just
                press <b>ERASE</b> button. You will need to provide new secret word. Also it can
                help if you suddenly forget the secret word.
            </Typography>
            <KeyEnterInput
                label={"Secret word"}
                onChange={(e) => setKey(e.target.value)}
                onEnterPress={() => setReq.mutate({ref: "", key})}
                hidden
            />
        </StartupBlock>
    )

    function renderButtons() {
        return (
            <>
                <EraseButton safe={false}/>
                <StartupSecretButton keyWord={key} refWord={""}/>
            </>
        )
    }
}
