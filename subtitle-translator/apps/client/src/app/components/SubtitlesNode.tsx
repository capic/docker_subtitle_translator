import axios from 'axios';
import { Dree } from 'dree';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { ModifiedDree } from '../type';

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
    { data: { number: number; language: string; type: string }[] }
  >({
    queryKey: ['fetchSubtitles', uuid],
    queryFn: () => fetchSubtiles(uuid),
  });

  const mutationTranslate = useMutation({
    mutationFn: (number: Number) => {
      return axios.post(
        'http://192.168.1.106:3333/api/files/:uuid/subtitles/:number/translate',
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
          {subtitle.language ?? 'default'} - {subtitle.name}
        </li>
      ))}
    </ul>
  );
};

export default SubtitlesNode;
