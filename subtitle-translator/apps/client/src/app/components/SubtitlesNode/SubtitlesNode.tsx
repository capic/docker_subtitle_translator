import axios from 'axios';
import { Dree } from 'dree';
import { useMutation, useQuery } from '@tanstack/react-query';
import SubtitleText from '../SubtitleText/SubtitleText';
import {
  ModifiedDree,
  SubInfo,
  Subtitle,
  Subtitles,
  subtitlesSchema,
} from '@subtitle-translator/shared';
import SubtitleNode from '../SubtitleNode/SubtitleNode';

const fetchSubtiles = async (uuid: ModifiedDree<Dree>['uuid']) => {
  const { data } = await axios.get(
    `http://192.168.1.106:3333/api/files/${uuid}/subtitles`,
  );

  const parsed = subtitlesSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
};

interface Props {
  uuid: ModifiedDree<Dree>['uuid'];
}

const SubtitlesNode = ({ uuid }: Props) => {
  const { error, data, isLoading } = useQuery<Subtitles>({
    queryKey: ['fetchSubtitles', uuid],
    queryFn: () => fetchSubtiles(uuid),
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
    <ul>
      {data.map((subtitle) => (
        <SubtitleNode subtitle={subtitle}/>
      ))}
    </ul>
  );
};

export default SubtitlesNode;
