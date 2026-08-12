export default function ProgressBar ({ score }) {
    return (
        <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(score, 100)}%` }}/>
        </div>
    )
}