import axios from 'axios';
import { Dree } from 'dree';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ModifiedDree, Subtitle,
  Subtitles,
  subtitlesSchema
} from '@subtitle-translator/shared';
import SubtitleNode from '../SubtitleNode/SubtitleNode';
import { useCallback, useState } from 'react';

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
  const [subtitles, setSubtitles] = useState<Subtitles>([])

  const addSubtitle = useCallback((subtitle: Subtitle) => {
    setSubtitles([...subtitles, subtitle])
  },[])

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
      {subtitles.map((subtitle) => (
        <SubtitleNode subtitle={subtitle} addSubtitle={addSubtitle}/>
      ))}
    </ul>
  );
};

export default SubtitlesNode;
