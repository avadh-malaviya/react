const SimpleCheckbox = ({value, ...rest}) => {
    return <><input type={`checkbox`} className="from-input customize" value={value} {...rest} /></>
}
export default SimpleCheckbox