import { Link } from "react-router-dom";

export default function LinkButton(props: linkButtonPropTypes) {
  const { name, to } = props;
  return (
    <Link
      to={to}
      className="rounded-sm bg-skin-accent px-3 py-1 text-white outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring"
    >
      {name}
    </Link>
  );
}

type linkButtonPropTypes = {
  name: string;
  to: string;
};
