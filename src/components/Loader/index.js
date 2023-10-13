import Spinner from "react-bootstrap/Spinner"

export const Loader = ({small}) => {
    return <div className={`d-flex loader-group ${small}`}>
        <Spinner animation="grow" variant="secondary" size="sm" />
        <Spinner animation="grow" variant="secondary" size="sm" />
        <Spinner animation="grow" variant="secondary" size="sm" />
        <Spinner animation="grow" variant="secondary" size="sm" />
    </div>
}