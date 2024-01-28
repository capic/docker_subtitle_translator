import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Dree, Type } from 'dree';
import FolderNode from './components/FolderNode';
import FileNode from './components/FileNode';
import { ModifiedDree } from './type';

const fetch = () => {
  return axios.get('http://192.168.1.106:3333/api/files');
};

const App2 = () => {
  const { data, error, isLoading } = useQuery<{}, {}, { data: ModifiedDree<Dree> }>({
    queryKey: 'fetch',
    queryFn: fetch,
    refetchOnWindowFocus: false,
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
    <div className="App">
      <div>{data.data.name}</div>
      <ul>
        {data.data.children?.map((child) =>
          child.type === Type.DIRECTORY ? (
            <FolderNode  node={child} />
          ) : (
            <FileNode node={child} />
          )
        )}
      </ul>
    </div>
  );
};

export default App2;
