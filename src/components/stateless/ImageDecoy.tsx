import { useState, useMemo, useLayoutEffect } from "react";

export default function ImageDecoy(props: propsType) {
  const { src, title, alt } = props;
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageComponent, setImageComponent] = useState<JSX.Element | null>(
    null,
  );

  const handleImageError = () => {
    setImageLoadError(true);
  };

  useLayoutEffect(() => {
    const imgComponent = (
      <img
        alt={alt}
        src={src}
        title={title}
        onError={handleImageError}
        className="select-none"
      />
    );
    setImageComponent(imgComponent);
  }, [src, title, alt]);

  const errorComponent = useMemo(
    () => (
      <span className="block w-fit rounded text-sm font-medium text-skin-error">
        Image failed to load
      </span>
    ),
    [],
  );

  return <>{imageLoadError ? errorComponent : imageComponent}</>;
}

type propsType = {
  src?: string;
  alt?: string;
  title?: string;
};
