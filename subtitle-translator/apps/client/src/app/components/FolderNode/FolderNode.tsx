import { Dree } from 'dree';
import { useState } from 'react';
import FolderContent from '../FolderContent/FolderContent';
import { FcFolder } from 'react-icons/fc';
import type { ModifiedDree } from '@subtitle-translator/shared';

interface Props {
  node: ModifiedDree<Dree>;
}

const FolderNode = ({ node }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <li key={node.uuid}>
      <div onClick={() => setOpen(!open)}>
        <FcFolder />
        {node.name}
      </div>
      {open && <FolderContent uuid={node.uuid} />}
    </li>
  );
};

export default FolderNode;
