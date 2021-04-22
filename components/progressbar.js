const ProgressBar = ({percentage}) => {
    return (
        <div className="progressbar">
            <div style={{width : `${percentage}%`}} className="progressbar-step"></div>
        </div>
    )
}
export default ProgressBar