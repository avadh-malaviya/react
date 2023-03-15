import React from "react";

function PlanButton({className = '', children = 'Plan', color = 'green', type='plat', ...rest}) {
    return <>
        <button className={`btn planbutton ${type} ${color} ${className}`} {...rest}>{children}</button>
    </>
}
export default PlanButton;