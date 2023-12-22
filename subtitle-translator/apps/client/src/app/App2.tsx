import axios from 'axios';
import { useQuery } from 'react-query';
import FolderTree from './components/FolderTree';
import Styled from 'styled-components';
import { Dree } from 'dree';

const StyledContainer = Styled.div`
position: absolute;
top: 50%;
left:50%;
transform: translate(-50%, -50%);
width : 400px;
height: 600px;
overflow-y: auto;
background-color:papayawhip;
padding: 2rem;
border-radius:20px;
`;

const fetchFiles = async () => {
  return await axios.get<Dree>(
    'http://192.168.1.106:3333/api/files');
};

const App2 = () => {
  const { data, error, isFetching } = useQuery('listRootDirectories', () =>
    fetchFiles()
  );

  if (isFetching) {
    return <>Loading....</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (!data) {
    return <>No data</>
  }

  return (

      <FolderTree json={data.data} />

  );
};

export default App2;
