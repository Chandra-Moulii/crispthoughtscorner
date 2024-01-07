import { useNavigate } from "react-router-dom";

export default function Header(props: headerPropsType) {
  const { title, prev, fn } = props;
  const navigate = useNavigate();

  function goBack() {
    if (fn) {
      if (!fn()) return;
    }
    if (prev) navigate(prev);
    else navigate(-1);
  }

  return (
    <header className="flex items-center gap-4 py-3">
      <button
        onClick={goBack}
        className="rounded-sm outline-none ring-skin-color/30 focus-visible:ring"
      >
        <svg
          viewBox="0 -960 960 960"
          className="aspect-square w-5 fill-skin-color"
        >
          <path d="m275.845-454.873 239.744 239.488L480-180.001 180.001-480 480-779.999l35.589 35.384-239.744 239.488h504.154v50.254H275.845Z" />
        </svg>
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}

type headerPropsType = {
  title?: string;
  prev?: string;
  fn?: () => boolean;
};
