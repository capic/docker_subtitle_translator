import { ThreeDots } from 'react-loading-icons';
import { Subtitle } from '@subtitle-translator/shared';

interface Props {
  subtitle: Subtitle;
  isLoading: boolean;
}

const SubtitleText = ({ subtitle, isLoading }: Props) => {
  return (
    <>
      {subtitle.language ?? 'default'}
      {subtitle.name ? ` -  ${subtitle.name}` : null}
      {isLoading && (
        <ThreeDots role="progressbar" stroke="#000000" height={10} width={20} />
      )}
    </>
  );
};

export default SubtitleText;
