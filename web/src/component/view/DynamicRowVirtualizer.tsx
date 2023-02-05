import React, {useRef} from "react";
import {useVirtualizer} from "@tanstack/react-virtual";
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

const SX = {
    container: {width: "100%", overflow: "auto", contain: "strict"},
    boxRelative: {width: "100%", position: "relative"},
    boxAbsolute: {position: "absolute", top: 0, left: 0, width: "100%"},
}

type Props = {
    height: number;
    rows: string[],
    sx?: SxProps<Theme>,
    className?: string,
    sxVirtualRow?: SxProps<Theme>,
    classNameVirtualRow?: string,
}

/**
 *
 * Guide https://tanstack.com/virtual/v3/docs/examples/react/dynamic
 */
export function DynamicRowVirtualizer({rows, height, sx, className, sxVirtualRow, classNameVirtualRow}: Props) {
    const parentRef = useRef<Element>(null)

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 125,
    })

    const items = virtualizer.getVirtualItems()

    return (
        <Box ref={parentRef} sx={{...sx, ...SX.container}} className={className} style={{height: `${height}px`}}>
            <Box sx={SX.boxRelative} style={{height: virtualizer.getTotalSize()}}>
                <Box sx={SX.boxAbsolute} style={{transform: `translateY(${items[0].start}px)`}}>
                    {items.map((virtualRow) => (
                        <Box
                            ref={virtualizer.measureElement}
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                        >
                            <Box sx={sxVirtualRow} className={classNameVirtualRow}>
                                {rows[virtualRow.index]}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
