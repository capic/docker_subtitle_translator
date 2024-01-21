import { Dree } from 'dree';
import { useState } from 'react';
import FolderContent from './FolderContent';
import React from 'react';
import styled from 'styled-components';
import { FcFolder } from 'react-icons/fc';

interface Props {
  node: Dree;
}

const FolderNode = ({ node }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <li>
      <div onClick={() => setOpen(!open)}>
        <FcFolder />
        {node.name}
      </div>
      {open && <FolderContent hash={node.hash} />}
    </li>
  );
};

export default FolderNode;
