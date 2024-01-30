export default function Spinner(props: spinnerProps) {
  const { info } = props;
  return (
    <div className="pt-7">
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-5 animate-spin">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
          ></path>
        </svg>
        <p className="text-sm">{info}</p>
      </div>
    </div>
  );
}

type spinnerProps = {
  info: string;
};
