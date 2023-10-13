import { LinkSimpleHorizontal } from "phosphor-react";

const Link = (props) => {
  const host = new URL(props.data.link).host;
  let description = "";
  if (props.data.meta.description) {
    const element = document.createElement("textarea");
    element.innerHTML = props.data.meta.description;
    description = element.value;
  }
  return (
    <div className="output-cdx-block">
      <div className="output-link-tool">
        <a
          className="output-link-tool__content"
          target="_blank"
          rel="nofollow noindex noreferrer"
          href={props.data.link}
        >
          <div
            className="output-link-tool__image"
            style={{
              backgroundImage: "url(" + props.data?.meta?.image?.url + ")",
            }}
          ></div>
          <div className="output-link-tool__title">
            <div>{props.data.meta.title}</div>
            <div className="output-link-tool__title-link-icon"><LinkSimpleHorizontal size={16} /></div>
          </div>
          <p className="output-link-tool__description">{description}</p>
          <span className="output-link-tool__anchor">
            {host || props.data?.meta?.title}
          </span>
        </a>
      </div>
    </div>
  );
};

export default Link;
