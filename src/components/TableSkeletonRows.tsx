const TableSkeletonRows = ({ rows, cols }: { rows: number; cols: number }) => (
    <>
        {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t border-neutral-300 bg-4">
                {Array.from({ length: cols }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                    </td>
                ))}
            </tr>
        ))}
    </>
)

export default TableSkeletonRows