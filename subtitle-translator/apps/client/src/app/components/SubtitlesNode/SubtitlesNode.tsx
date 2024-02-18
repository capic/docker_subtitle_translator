import axios from 'axios';
import { Dree } from 'dree';
import { useMutation, useQuery } from '@tanstack/react-query';
import { subtitlesSchema, type ModifiedDree, Subtitles } from '../../type';
import SubtitleText from '../SubtitleText/SubtitleText';

const fetchSubtiles = async (uuid: ModifiedDree<Dree>['uuid']) => {
  const { data } = await axios.get(
    `http://192.168.1.106:3333/api/files/${uuid}/subtitles`
  );

  const parsed = subtitlesSchema.safeParse(data);

  if (!parsed.success) {
    console.log(parsed.error.message)
    throw new Error(parsed.error.message)
  }

  return parsed.data
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

  const mutationTranslate = useMutation({
    mutationFn: (number: number) => {
      return axios.post('http://192.168.1.106:3333/api/subtitles/translate', {
        uuid,
        number,
      });
    },
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

  const translate = (number?: number) => {
    if (!number) {
      return
    }

    mutationTranslate.mutate(number)
  }

  return (
    <ul>
      {data.map((subtitle) => (
        <li key={subtitle.number} onClick={() => translate(subtitle.number)}>
          <SubtitleText
            subtitle={subtitle}
            isLoading={mutationTranslate.isPending}
          />
        </li>
      ))}
    </ul>
  );
};

export default SubtitlesNode;
