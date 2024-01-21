import axios from 'axios';
import { Dree } from 'dree';
import React, { useState } from 'react';
import { FcFile } from 'react-icons/fc';
import { useMutation } from 'react-query';
import SubtitlesNode from './SubtitlesNode';

const FileNode = ({ node }: { node: Dree }) => {
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);

  return (
    <li>
      <div onClick={() => setShowSubtitles(!showSubtitles)}>
        <FcFile />
        {node.name}
      </div>
      {showSubtitles && <SubtitlesNode hash={node.hash} />}
    </li>
  );
};

export default FileNode;
