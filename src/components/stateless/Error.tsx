import Header from "./Header";
import LinkButton from "./LinkButton";

export default function Error(props: errorPropTypes) {
  const { info } = props;
  return (
    <>
      <Header />
      <div className="flex flex-col items-center gap-3">
        <p className="text mb-2 mt-4 font-medium">{info}</p>
        <LinkButton name="Home" to="/" />
      </div>
    </>
  );
}

type errorPropTypes = {
  info: string;
};
