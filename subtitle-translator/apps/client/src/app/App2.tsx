import axios from 'axios';
import { useQuery } from 'react-query';
import FolderTree from './components/FolderTree';
import Styled from 'styled-components';
import { Dree } from 'dree';

import RowContainer from './components/RowContainer';

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


const App2 = () => {
  return (
    <>
      <RowContainer type="folder" name="/" />
      <FolderTree />
    </>
  );
};

export default App2;
