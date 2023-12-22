import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { FcFolder, FcFile } from "react-icons/fc";

const Row = Styled.div`
    display:flex;
    align-items: center;
    cursor:${({ type } : {type:string}) => type === 'folder' ? 'pointer' : null};
    padding: 0rem;
    margin: 0rem;height: 2rem;
`

const Name = Styled.h5`
    margin-left: 0.5rem;
`;

interface Props {
    type: string
    name: string
    handleClick: () => void
}

const RowContainer = ({ type, name, handleClick }: Props) => {
    return (
        <Row type={type} onClick={handleClick}>
            {type === 'folder' ? <FcFolder /> : <FcFile />}
            <Name>{name}</Name>
        </Row>
    )
}

export default RowContainer;