import { useState } from 'react';
import Styled from 'styled-components';
import RowContainer from './RowContainer';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Dree, Type } from 'dree';

const Container = Styled.div`
    padding:0rem 1.5rem;
`


interface Props {
    json: Dree
}

const FolderTree = ({ json }: Props) => {
    const mutation = useMutation({
        mutationFn: (filePath: string) => {
          return axios.post('http://192.168.1.106:3333/api/translate', {filePath})
        },
      })
    const [expand, setExpand] = useState(false);
    const handleClick = () => {
        setExpand(!expand);
    }

    const sendFile = (file: Dree) => {
        mutation.mutate(file.name)
    }

    if (json.type === Type.DIRECTORY) {
        return (
            <Container>
                <RowContainer type={'folder'} name={json.name} handleClick={handleClick} />

                <div style={{ display: expand ? 'block' : 'none' }}>
                    {json.children?.map(child => {
                        return <FolderTree key={child.name} json={child} />
                    })}
                </div>
            </Container>
        );
    } else {
        return (
            <Container>
                <RowContainer type={'file'} name={json.name} handleClick={() => sendFile(json)}/>
            </Container>
        )
    }

}

export default FolderTree;