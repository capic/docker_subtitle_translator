import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FcFile, FcFolder } from 'react-icons/fc';
import styled from 'styled-components';
import { Dree, Type } from 'dree';
import FolderNode from './FolderNode';
import FileNode from './FileNode';

const Name = styled.h5`
  margin-left: 0.5rem;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  cursor: ${({ type }: { type: string }) =>
    type === 'folder' ? 'pointer' : null};
  padding: 0rem;
  margin: 0rem;
  height: 2rem;
`;

const fetchFolder = async (hash?: string) => {
  return await axios.get(`http://192.168.1.106:3333/api/directories/${hash}/files`);
};

interface Props {
  hash: Dree['hash'];
}

const FolderContent = ({ hash }: Props) => {
  const { data, error, isLoading } = useQuery<{}, {}, { data: Dree }>({
    queryKey:[ 'fetchFolderContent', hash],
    queryFn: () => fetchFolder(hash),
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Error: {error}</>;
  }

  if (!data) {
    return <>No data</>;
  }

  return (
    <ul>
      {data.data.children?.map((child) =>
        child.type === Type.DIRECTORY ? (
          <FolderNode key={child.hash} node={child} />
        ) : (
          <FileNode key={child.hash} node={child} />
        )
      )}
    </ul>
  );
};

export default FolderContent;
