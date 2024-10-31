/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
export const ImageGenerator = (props) => {
  if (!props.image) {
    return <p className="text-center p-4">Upload an image first.</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        padding: props.settings.padding,
      }}
    >
      <img
        src={props.image.src}
        style={{
          boxShadow: `0 0 ${props.settings.shadow}px rgba(0,0,0,.${props.settings.shadow})`,
          borderRadius: props.settings.radius,
          display: "flex",
        }}
      />
    </div>
  );
};
