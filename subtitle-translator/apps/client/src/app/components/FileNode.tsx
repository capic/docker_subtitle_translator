import axios from 'axios';
import { Dree } from 'dree';
import React, { useState } from 'react';
import { FcFile } from 'react-icons/fc';
import { useMutation } from 'react-query';
import SubtitlesNode from './SubtitlesNode';
import { ModifiedDree } from '../type';

const FileNode = ({ node }: { node: ModifiedDree<Dree> }) => {
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);

  return (
    <li>
      <div onClick={() => setShowSubtitles(!showSubtitles)}>
        <FcFile />
        {node.name}
      </div>
      {showSubtitles && <SubtitlesNode uuid={node.uuid} />}
    </li>
  );
};

export default FileNode;
