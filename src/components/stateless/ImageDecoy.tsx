import React, { useState, useMemo, useLayoutEffect } from "react";

export default function ImageDecoy(props: propsType) {
  const { src, fn, title, alt } = props;
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageComponent, setImageComponent] = useState<JSX.Element | null>(
    null,
  );

  const handleImageError = () => {
    setImageLoadError(true);
  };

  useLayoutEffect(() => {
    const imgComponent = (
      <button
        className="my-2 rounded-sm outline-none ring-skin-color/50 ring-offset-1 ring-offset-skin-background focus-visible:ring sm:pointer-events-none md:pointer-events-auto lg:pointer-events-auto"
        onClick={fn}
      >
        <img
          src={src}
          title={title}
          alt={alt}
          onClick={fn}
          draggable={false}
          onError={handleImageError}
          className="cursor-pointer select-none"
        />
      </button>
    );
    setImageComponent(imgComponent);
  }, [src, fn, title, alt]);

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
  fn?: (event: React.MouseEvent) => void;
};
