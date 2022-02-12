import { css } from "@emotion/css";
import { Editor } from "@sno2wiki/editor";
import React from "react";

import { generateCommitId, generateLineId } from "./createId";

export const App: React.VFC = () => {
  return (
    <div
      className={css({
        margin: "64px 64px",
        /*userSelect: "none" */
      })}
    >
      <p>EDITOR TEST</p>
      <Editor
        online={{
          head: generateLineId(),
          lines: [
            { id: generateCommitId(), text: "ダークらき☆すたｷﾀ━━━━(ﾟ∀ﾟ)━━━━!!" },
            { id: generateCommitId(), text: "...where you must rest your weary bones" },
            { id: generateCommitId(), text: "シメジシミュレーション" },
            { id: generateCommitId(), text: "インターネットやめないで" },
            { id: generateCommitId(), text: "@" },
            { id: generateCommitId(), text: "<strong>A</strong>" },
            { id: generateCommitId(), text: "استمع (؟·معلومات)، ومعناها" },
          ],
        }}
        pushCommits={(commits) => {
          console.dir(commits);
        }}
        generateCommitId={generateCommitId}
        generateLineId={generateLineId}
      />
    </div>
  );
};
