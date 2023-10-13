import Checklist from "./CheckList";
import CodeBlock from "./CodeBlock";
import Header from "./Header";
import Image from "./Image";
import List from "./List";
import Link from "./Link";
import Paragraph from "./Paragraph";
import Quote from "./Quote";
import Table from "./Table";
import NoticeBlock from "./NoticeBlock";
import Embed from "./Embed";
import { CheckCircle, Info, Warning, WarningCircle } from "phosphor-react";

const LineBreak = () => {
  return (
    <div className="output-cdx-block no-block-margin">
      <div className="output-ce-line-break">
        <br />
      </div>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="output-cdx-block">
      <div className="output-ce-divider"></div>
    </div>
  );
};

function EditorJSOutput(props) {
  let { data, style, config } = props;

  if (!data || typeof data !== "object") return null;
  if (!style || typeof style !== "object") style = {};
  if (!config || typeof config !== "object") config = {};

  return (
    <div
      className={`editor-js-output`}
    >
      {data.blocks?.map((block, index) => {
        switch (block.type) {
          case "code":
            return (
              <CodeBlock
                data={block.data}
                style={style.link || {}}
                config={config.link || {}}
                applyTheme={props.applyTheme || false}
              />
            );
          case "link":
            return (
              <Link
                data={block.data}
                style={style.link || {}}
                config={config.link || {}}
              />
            );
          case "linebreak":
            return <LineBreak />;
          case "header":
            return (
              <Header
                data={block.data}
                style={style.header || {}}
                config={config.header || {}}
              />
            );
          case "paragraph":
            return (
              <Paragraph
                data={block.data}
                style={style.paragraph || {}}
                config={config.paragraph || {}}
              />
            );
          case "image":
            return (
              <Image
                data={block.data}
                style={style.image || {}}
                config={config.image || {}}
              />
            );
          case "embed":
            return (
              <Embed
                data={block.data}
                style={style.image || {}}
                config={config.image || {}}
              />
            );
          case "table":
            return (
              <Table
                data={block.data}
                style={style.image || {}}
                config={config.image || {}}
              />
            );
          case "list":
            return (
              <List
                data={block.data}
                style={style.image || {}}
                config={config.image || {}}
              />
            );
          case "checklist":
            return (
              <Checklist
                data={block.data}
                style={style.image || {}}
                config={config.image || {}}
              />
            );
          case "quote":
            return (
              <Quote
                data={block.data}
                style={style.image || {}}
                config={config.image || {}}
              />
            );
          case "warning":
            return (
              <NoticeBlock
                data={block.data}
                type="warning"
                icon={
                  <WarningCircle
                    size={props.applyTheme ? 18 : 24}
                    className="output-cdx-notice-block-icon"
                  />
                }
              />
            );
          case "success":
            return (
              <NoticeBlock
                data={block.data}
                type="success"
                icon={
                  <CheckCircle
                    size={props.applyTheme ? 18 : 24}
                    className="output-cdx-notice-block-icon"
                  />
                }
              />
            );
          case "info":
            return (
              <NoticeBlock
                data={block.data}
                type="info"
                icon={
                  <Info
                    size={props.applyTheme ? 18 : 24}
                    className="output-cdx-notice-block-icon"
                  />
                }
              />
            );
          case "error":
            return (
              <NoticeBlock
                data={block.data}
                type="error"
                icon={
                  <Warning
                    size={props.applyTheme ? 18 : 24}
                    className="output-cdx-notice-block-icon"
                  />
                }
              />
            );
          case "divider":
            return <Divider />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default EditorJSOutput;
