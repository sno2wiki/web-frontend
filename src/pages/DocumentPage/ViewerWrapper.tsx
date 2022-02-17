import { Viewer } from "@sno2wiki/viewer";
import React from "react";

import { useViewer } from "~/hooks/useViewer";

export const ViewerWrapper: React.VFC<{ documentId: string; }> = ({ documentId }) => {
  const { lines } = useViewer({ documentId });
  return (
    <div>
      {!lines && <p>LOADING</p>}
      {lines && <Viewer lines={lines} />}
    </div>
  );
};
