import { postType } from "../../pages/Feed";
import { Dispatch, SetStateAction } from "react";

export default function Pagination(props: paginationProps) {
  const { page, fun, data, ITMESPERPAGE } = props;
  return (
    <>
      <div className="ml-auto w-fit">
        <div className="my-5 flex items-center justify-end gap-2">
          {page === 1 ? null : (
            <div className="flex items-center gap-2 ">
              <button
                onClick={() => fun((prev) => prev - 1)}
                className="rounded-sm outline-none ring-skin-color/30 focus-visible:ring"
              >
                <svg
                  viewBox="0 -960 960 960"
                  className="aspect-square w-5 fill-skin-color"
                >
                  <path d="m275.845-454.873 239.744 239.488L480-180.001 180.001-480 480-779.999l35.589 35.384-239.744 239.488h504.154v50.254H275.845Z" />
                </svg>
              </button>
            </div>
          )}

          {data?.length < ITMESPERPAGE ? null : (
            <div className="flex items-center gap-2 ">
              <button
                onClick={() => fun((prev) => prev + 1)}
                className="rounded-sm outline-none ring-skin-color/30 focus-visible:ring"
              >
                <svg
                  viewBox="0 -960 960 960"
                  className="aspect-square w-5 rotate-180 fill-skin-color"
                >
                  <path d="m275.845-454.873 239.744 239.488L480-180.001 180.001-480 480-779.999l35.589 35.384-239.744 239.488h504.154v50.254H275.845Z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

type paginationProps = {
  page: number;
  data: postType[];
  ITMESPERPAGE: number;
  fun: Dispatch<SetStateAction<number>>;
};
