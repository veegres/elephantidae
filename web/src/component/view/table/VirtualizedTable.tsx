import scroll from "../../../style/scroll.module.css";
import {Box, CircularProgress, Tooltip} from "@mui/material";
import {SxPropsMap} from "../../../type/general";
import {Fragment, ReactNode, useMemo, useState} from "react";
import {useVirtualizer} from "@tanstack/react-virtual";
import {NoBox} from "../box/NoBox";
import {useDragger} from "../../../hook/Dragger";
import {MenuButton} from "../button/MenuButton";

const SX: SxPropsMap = {
    box: {position: "relative"},
    body: {overflow: "auto", width: "100%", height: "100%", fontSize: "12px"},
    loader: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 5,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "inherit", height: "inherit", bgcolor: "rgba(31,44,126,0.05)",
    },
    cell: {
        position: "absolute", top: 0, left: 0, zIndex: 0, padding: "5px 10px",
        bgcolor: "background.paper", border: 1, borderColor: "divider",
        "&:hover": {
            overflow: "auto", zIndex: 1,
            width: "auto!important", height: "auto!important",
            maxHeight: "150px", maxWidth: "400px",
        },
        "&:hover div": {
            whiteSpace: "pre", overflow: "unset", textOverflow: "unset",
        }
    },
    noWrap: {whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%"},
    preWrap: {whiteSpace: "pre-wrap", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%"},
    cellFixed: {
        position: "absolute", top: 0, left: 0, padding: "5px 10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "text.disabled", bgcolor: "background.paper", border: 1, borderColor: "divider",
    },
    columnSeparator: {
        position: "absolute", top: 0, left: 0, zIndex: 4,
        cursor: "col-resize", touchAction: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        "&:hover:after": {content: `""`, width: "20%", height: "60%", bgcolor: "secondary.light", borderRadius: "10px"},
    },
    headTitle: {display: "flex", fontFamily: "monospace", gap: "4px"},
    empty: {padding: "10px"},
}

type Props = {
    columns: { name: string, description?: string }[],
    rows: any[][],
    loading?: boolean,
    showIndexColumn?: boolean,
    renderRowActions?: (row: any[]) => ReactNode,
    width?: number,
    height?: number,
}

export function VirtualizedTable(props: Props) {
    const {columns, rows, renderRowActions, showIndexColumn = true} = props
    const {loading = false, width, height = 306} = props
    const [ref, setRef] = useState<Element | null>(null);

    const columnSize = columns.length
    const scrollSize = 6

    const cellWidthStickyIndex = showIndexColumn ? 50 : 0
    const cellWidthStickyAction = renderRowActions ? 38 : 0
    const cellHeightStickyHead = 32

    // NOTE: we need to multiply by 2 because we have padding between table and scroll and sometimes
    //  scroll can be presented or not, so it is safer to always multiple
    const cellOffset = cellWidthStickyIndex + cellWidthStickyAction + (scrollSize * 2)
    const cellWidth = useMemo(() => width ? (width - cellOffset) / columnSize : 100, [cellOffset, columnSize, width])
    const cellHeight = 30
    // NOTE: calculate the cell width, the component should be rendered from scratch to change the size,
    //  this is how useVirtualizer work (-1 is needed to always choose 100 if width is unknown)
    const cellCalcWidth = useMemo(() => Math.max((((ref?.clientWidth ?? -1) - cellOffset) / columnSize), cellWidth), [cellOffset, cellWidth, columnSize, ref?.clientWidth])

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => ref,
        estimateSize: () => cellHeight,
        scrollPaddingStart: cellHeightStickyHead,
        overscan: 3,
        enabled: ref !== null,
    })
    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: columnSize,
        getScrollElement: () => ref,
        estimateSize: () => cellCalcWidth,
        scrollPaddingStart: cellWidthStickyIndex,
        scrollPaddingEnd: cellWidthStickyAction,
        overscan: 3,
        // NOTE: this helps to use cellWidth, because in first render when we don't have ref, it
        //  renders incorrect size
        enabled: ref !== null,
    })
    const columnDragger = useDragger(columnVirtualizer.resizeItem)

    const boxWidthPx = width ? `${width}px` : "100%"
    const boxHeightPx = `${height}px`
    const bodyWidthPx = `${columnVirtualizer.getTotalSize()}px`
    const bodyHeightPx = `${rowVirtualizer.getTotalSize()}px`
    const cellWidthStickyIndexPx = `${cellWidthStickyIndex}px`
    const cellWidthStickyActionPx = `${cellWidthStickyAction}px`
    const cellHeightStickyHeadPx = `${cellHeightStickyHead}px`
    const cellHeightPx = `${cellHeight}px`

    return (
        <Box sx={SX.box} width={boxWidthPx} height={boxHeightPx}>
            {renderLoader()}
            {columns.length > 0 ? renderTable() : renderEmpty()}
        </Box>
    )

    function renderLoader() {
        if (!loading) return
        return (
            <Box sx={SX.loader}>
                <CircularProgress/>
            </Box>
        )
    }

    function renderEmpty() {
        if (loading) return
        return (
            <Box sx={SX.empty}>
                <NoBox text={"NO DATA"}/>
            </Box>
        )
    }

    function renderTable() {
        return (
            <Box
                ref={setRef}
                sx={SX.body}
                padding={`0px ${scrollSize}px ${scrollSize}px 0px`}
                display={"grid"}
                gridTemplateColumns={`${cellWidthStickyIndexPx} ${bodyWidthPx} ${cellWidthStickyActionPx}`}
                gridTemplateRows={`${cellHeightStickyHeadPx} ${bodyHeightPx}`}
                className={scroll.small}
            >
                <Box position={"sticky"} zIndex={4} top={0} left={0}>
                    {showIndexColumn && renderCorner(cellWidthStickyIndexPx)}
                </Box>
                <Box position={"sticky"} zIndex={3} top={0}>
                    {renderHead()}
                </Box>
                <Box position={"sticky"} zIndex={2} top={0}>
                    {renderRowActions && renderCorner(cellWidthStickyActionPx)}
                </Box>
                <Box position={"sticky"} zIndex={3} left={0}>
                    {renderIndex()}
                </Box>
                <Box position={"relative"}>
                    {renderBody()}
                </Box>
                <Box position={"relative"}>
                    {renderActions()}
                </Box>
            </Box>
        )
    }

    function renderCorner(width: string) {
        return (
            <Box sx={SX.cellFixed} style={{width, height: cellHeightStickyHeadPx}}/>
        )
    }

    function renderHead() {
        const dragWidth = scrollSize * 2
        const dragWidthPx = `${dragWidth}px`

        return columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const column = columns[virtualColumn.index]
            const width = `${virtualColumn.size}px`
            const transform = `translateX(${virtualColumn.start}px)`
            const dragTransform = `translateX(${virtualColumn.end - scrollSize}px)`
            return (
                <Fragment key={virtualColumn.key}>
                    <Box sx={SX.cellFixed} style={{width, height: cellHeightStickyHeadPx, transform}}>
                        <Tooltip title={renderHeadTitle(column.name, column.description)} placement={"top"}>
                            <Box sx={SX.noWrap}>{column.name}</Box>
                        </Tooltip>
                    </Box>
                    <Box
                        sx={SX.columnSeparator}
                        style={{width: dragWidthPx, height: cellHeightStickyHeadPx, transform: dragTransform}}
                        onMouseDown={(e) => columnDragger.onMouseDown(e, virtualColumn.index, virtualColumn.size)}
                    />
                </Fragment>
            )
        })
    }

    function renderIndex() {
        if (!showIndexColumn) return
        return rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const transform = `translateY(${virtualRow.start}px)`
            return (
                <Box key={virtualRow.key} sx={SX.cellFixed} style={{width: cellWidthStickyIndexPx, height: cellHeightPx, transform}}>
                    {virtualRow.index + 1}
                </Box>
            )
        })
    }

    function renderActions() {
        if (!renderRowActions) return
        return rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]
            const transform = `translateY(${virtualRow.start}px)`
            return (
                <Box key={virtualRow.key} sx={SX.cellFixed} style={{width: cellWidthStickyActionPx, height: cellHeightPx, transform}}>
                    <MenuButton>{renderRowActions(row)}</MenuButton>
                </Box>
            )
        })
    }

    function renderBody() {
        if (!columns) return
        const wrap = columnSize === 1 ? SX.preWrap : SX.noWrap
        return rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
                <Fragment key={virtualRow.key}>
                    {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                        const value = getParsedCell(row[virtualColumn.index])
                        const height = `${virtualRow.size}px`
                        const width = `${virtualColumn.size}px`
                        const transform = `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
                        return (
                            <Box
                                key={virtualColumn.key}
                                sx={SX.cell}
                                className={scroll.tiny}
                                style={{minWidth: width, minHeight: height, width, height, transform}}
                            >
                                <Box sx={wrap}>{value}</Box>
                            </Box>
                        )
                    })}
                </Fragment>
            )
        })
    }

    function renderHeadTitle(name: string, description?: string) {
        return (
            <Box sx={SX.headTitle}>
                <Box>{name}</Box>
                {description && <Box>({description})</Box>}
            </Box>
        )
    }

    function getParsedCell(cell: any): ReactNode {
        if (typeof cell === 'object') return JSON.stringify(cell)
        else if (typeof cell === "boolean") return Boolean(cell).toString()
        else return cell
    }
}