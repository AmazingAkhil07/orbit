import { cn } from "@/lib/utils";

interface GlassTableProps extends React.HTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
    className?: string;
}

export function GlassTable({ children, className, ...props }: GlassTableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <table className={cn("w-full caption-bottom text-sm text-left", className)} {...props}>
                {children}
            </table>
        </div>
    );
}

export function GlassTableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <thead className={cn("[&_tr]:border-b [&_tr]:border-white/5", className)} {...props} />;
}

export function GlassTableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function GlassTableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn(
                "border-b border-white/5 transition-colors hover:bg-white/5 data-[state=selected]:bg-white/10",
                className
            )}
            {...props}
        />
    );
}

export function GlassTableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn(
                "h-12 px-6 text-left align-middle font-medium text-zinc-400 uppercase tracking-wider text-xs",
                className
            )}
            {...props}
        />
    );
}

export function GlassTableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn("p-6 align-middle [&:has([role=checkbox])]:pr-0 text-zinc-300", className)}
            {...props}
        />
    );
}
