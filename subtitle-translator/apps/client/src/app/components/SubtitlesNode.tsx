import axios from 'axios';
import { Dree } from 'dree';
import { useMutation, useQuery } from 'react-query';
import { ModifiedDree } from '../type';
import { ThreeDots } from 'react-loading-icons'

const fetchSubtiles = async (uuid: ModifiedDree<Dree>['uuid']) => {
  return await axios.get(
    `http://192.168.1.106:3333/api/files/${uuid}/subtitles`
  );
};

interface Props {
  uuid: ModifiedDree<Dree>['uuid'];
}

const SubtitlesNode = ({ uuid }: Props) => {
  const { error, data, isLoading } = useQuery<
    {},
    {},
    { data: { number: number; language: string; type: string, name?: string }[] }
  >({
    queryKey: ['fetchSubtitles', uuid],
    queryFn: () => fetchSubtiles(uuid),
    refetchOnWindowFocus: false,
  });

  const mutationTranslate = useMutation({
    mutationFn: (number: Number) => {
      return axios.post(
        'http://192.168.1.106:3333/api/subtitles/translate',
        { uuid, number }
      );
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
console.log({data})
  return (
    <ul>
      {data.data.map((subtitle) => (
        <li onClick={() => mutationTranslate.mutate(subtitle.number)}>
          {subtitle.language ?? 'default'} - {subtitle.name} {mutationTranslate.isLoading && <ThreeDots />}
        </li>
      ))}
    </ul>
  );
};

export default SubtitlesNode;
