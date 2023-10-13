export const AttachmentImage = ({ base64String }, ...props) => {
  return (
    <img
      src={`data:image/png;base64,${base64String}`}
      {...props}
      width={"90%"}
      height={"250px"}
    />
  );
};
