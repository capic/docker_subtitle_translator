import axios from 'axios';
import { Dree } from 'dree';
import React from 'react';
import { useMutation, useQuery } from 'react-query';

const fetchSubtiles = async (hash: Dree['hash']) => {
  return await axios.get(
    `http://192.168.1.106:3333/api/file/${hash}/subtitles`
  );
};

interface Props {
  hash: Dree['hash'];
}

const SubtitlesNode = ({ hash }: Props) => {
  const { error, data, isLoading } = useQuery<
    {},
    {},
    { data: { number: number; language: string; type: string }[] }
  >({
    queryKey: 'fetchSubtitles',
    queryFn: () => fetchSubtiles(hash),
  });

  const mutationTranslate = useMutation({
    mutationFn: (number: Number) => {
      return axios.post(
        'http://192.168.1.106:3333/api/files/:hash/subtitles/:number/translate',
        { hash, number }
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

  return (
    <ul>
      {data.data.map((subtitle) => (
        <li onClick={() => mutationTranslate.mutate(subtitle.number)}>
          {subtitle.language}
        </li>
      ))}
    </ul>
  );
};

export default SubtitlesNode;
