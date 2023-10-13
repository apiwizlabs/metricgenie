import htmlParser from "html-react-parser";

const validListStyles = ['ordered', 'unordered'];

const List = ({ data, style, config }) => {
    if (!data) return null;
    if (!style || typeof style !== 'object') style = {};
  
    let listStyle = style;
    let content = [], listType = 'unordered';
  
    if (typeof data === 'string') content.push(data);
    else if (typeof data === 'object') {
      if (data.items && Array.isArray(data.items)) content = data.items.map((item, index) => <li className="output-cdx-list__item" key={ index }>{ htmlParser(item) }</li>);
      if (data.style && validListStyles.includes(data.style)) listType = data.style;
    }

  
    if (content.length <= 0) return null;
    if(listType === 'ordered') listStyle['paddingLeft'] = `${`${content.length}`.length}.15rem`
    let _listEl = null;
    if (listType === 'ordered') _listEl = <ol className="output-cdx-list output-cdx-list--ordered" style={ listStyle }>{ content }</ol>;
    else _listEl = <ul className="output-cdx-list output-cdx-list--unordered" style={ listStyle }>{ content }</ul>;

    return (
        <div className="output-cdx-block">
            {_listEl}
        </div>
    )
  };
  
  export default List;