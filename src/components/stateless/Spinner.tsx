export default function Spinner(props: spinnerProps) {
  const { info } = props;
  return (
    <div className="pt-7">
      <div className="flex flex-col items-center gap-2">
        <p className="aspect-square w-7 animate-spin rounded-full border-[3px] border-skin-color/20 border-t-skin-accent"></p>
        <p className="text-sm">{info}</p>
      </div>
    </div>
  );
}

type spinnerProps = {
  info: string;
};
