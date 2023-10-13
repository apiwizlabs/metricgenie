import embedOutputStyle from "./style";
import htmlParser from "html-react-parser";

const supportedStyles = ["video", "figure", "figcaption"];

const Embed = (props) => {
  let { data, style, config } = props;
  if (!data || !data.embed) return null;
  if (!style || typeof style !== "object") style = {};

  supportedStyles.forEach((customStyle) => {
    if (!style[customStyle] || typeof style[customStyle] !== "object")
      style[customStyle] = {};
  });

  const iframeStyle = config.disableDefaultStyle
    ? style.video
    : { ...embedOutputStyle.iframeStyle, ...style.video };

  if (data.width) iframeStyle.width = data.width;
  if (data.height) iframeStyle.height = data.height;

  const figureStyle = config.disableDefaultStyle
    ? style.figure
    : { ...embedOutputStyle.figureStyle, ...style.figure };
  const figcaptionStyle = config.disableDefaultStyle
    ? style.figcaption
    : { ...embedOutputStyle.figcaptionStyle, ...style.figcaption };

  return (
    <div className="output-cdx-block">
      <div className="output-cdx-embed">
        <figure style={figureStyle}>
          <iframe src={data.embed} style={iframeStyle}></iframe>
          {data.caption && (
            <figcaption style={figcaptionStyle}>
              {htmlParser(data.caption)}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
};

export default Embed;
