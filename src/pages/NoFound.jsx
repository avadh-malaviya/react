import React from 'react'
import Header from '../common/Header';

class noFound extends React.Component {
    constructor(props){
        super(props);

    }

    render() {
        return(<>
                <Header
                    title="Not found"
                    backgroundColor="#557381"
                />
            </>
        );
    }
}

export default noFound