import { useState } from 'react';
import Styled from 'styled-components';
import RowContainer from './RowContainer';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { Dree, Type } from 'dree';
import Subtitles from './Subtitles';

const Container = Styled.div`
    padding:0rem 1.5rem;
`;

interface Props {
  directoryHash?: string;
}

const fetchFolderTree = async (directoryHash?: string) => {
    const url = directoryHash ? `http://192.168.1.106:3333/api/directories/${directoryHash}/files` : `http://192.168.1.106:3333/api/files`
  return await axios.get<{ directoryHash?: string }>(url);
};

const FolderTree = ({ directoryHash }: Props) => {
  const { isLoading, error, data } = useQuery<{}, {}, {data: Dree} >({
    queryKey: 'folderTree',
    queryFn: () => fetchFolderTree(directoryHash),
    refetchOnWindowFocus: false
  });
  /* const mutation = useMutation({
    mutationFn: (filePath: string) => {
      return axios.post('http://192.168.1.106:3333/api/translate', {
        filePath,
      });
    },
  }); */
  const [expand, setExpand] = useState(false);
//   const [showSubtitles, setShowSubtitles] = useState<boolean>(false);

  const handleClick = () => {
    setExpand(!expand);
  };

  /* const exploreSubtitles = (file: Dree) => {
    mutationExploreSubtitle.mutate(file.path);
  }; */

  /* const sendFile = (file: Dree) => {
    mutation.mutate(file.path);
  }; */

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Error: {error}</>;
  }

  if (!data) {
    return <>No data</>;
  }
  
  return data.data.children?.map((child) => {
    if (child.type === Type.DIRECTORY) {
      return (
        <Container>
          <RowContainer
            type="folder"
            name={child.name}
            handleClick={handleClick}
          />
          {expand ? <FolderTree key={child.hash} directoryHash={child.hash} /> : null}
        </Container>
      );
    } else {
      return (
        <Container>
          <RowContainer
            type="file"
            name={child.name}
            // handleClick={() => setShowSubtitles(!showSubtitles)}
            handleClick={() => {}}
          />
          {/* {showSubtitles ? <Subtitles hash={child.hash} /> : null} */}
        </Container>
      );
    }
  });
};

export default FolderTree;
