import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import App from "../App";
import {Currencies} from "../scenes/currencies/Currencies";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            {/*<ComponentPreview path="/Profile">*/}
            {/*    <Profile/>*/}
            {/*</ComponentPreview>*/}
            {/*<ComponentPreview path="/ProductGrid">*/}
            {/*    <ProductGrid/>*/}
            {/*</ComponentPreview>*/}
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/Currencies">
                <Currencies/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews