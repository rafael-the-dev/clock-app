import './style.css';

const ContentGroup = ({ description, value }) => {
    return (
        <div className="align-center flex justify-between width-100 content-group">
            <span className="uppercase content-group__description">{ description }</span>
            <span className="content-group__value">{ value }</span>
        </div>
    );
};
//<p className="flex justify-between width-100 uppercase home__location-timezone"> </p>
export default ContentGroup;