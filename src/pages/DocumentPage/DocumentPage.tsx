import React from "react";
import { useParams } from "react-router-dom";

import { EditorWrapper } from "./EditorWrapper";
import { useDocument } from "./useDocument";
import { ViewerWrapper } from "./ViewerWrapper";

export const DocumentPage: React.VFC = () => {
  const { id: documentId } = useParams<"id">();
  const document = useDocument(documentId);

  if (!document.loaded) return <p>LOADING</p>;
  if (document.status === "bad") return <p>Document cannot view</p>;
  if (document.data.ticket === null) {
    return (
      <ViewerWrapper
        documentId={document.data.documentId}
      />
    );
  } else {
    return (
      <EditorWrapper
        documentId={document.data.documentId}
        ticket={document.data.ticket}
      />
    );
  }
};
