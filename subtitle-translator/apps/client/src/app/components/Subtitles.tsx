import axios from 'axios';
import React from 'react';
import { useMutation, useQuery } from 'react-query';

interface Props {
  hash?: string;
}

const getSubtitles = async (hash?: string) => {
  if (!hash) {
    return [];
  }
  return await axios.get<{ hash: string }>(
    `http://192.168.1.106:3333/api/files/${hash}/subtitles`
  );
};

const Subtitles = ({ hash }: Props) => {
  const { data, error, isLoading } = useQuery<
    {},
    {},
    { data: { number: number; language: string; type: string }[] }
  >({ queryKey: 'getSubtitles', queryFn: () => getSubtitles(hash) });

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

  console.log({ data });

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

export default Subtitles;
