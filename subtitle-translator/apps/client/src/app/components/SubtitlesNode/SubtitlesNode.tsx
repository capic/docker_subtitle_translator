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

  const mutationTranslate = useMutation({
    mutationFn: ({number}: { number: number }) => {
      return axios.post('http://192.168.1.106:3333/api/subtitles/translate', {
        uuid,
        number,
      });
    },
  });

  const mutationDownload = useMutation({
    mutationFn: ({ referer, link, language }: {referer:SubInfo['referer'], link:SubInfo['link'], language:string}) => {
      return axios.post('http://192.168.1.106:3333/api/subtitles/download', {
        uuid,
        referer,
        link,
        language,
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
      return;
    }

    mutationTranslate.mutate({ number });
  };

  const download = (subInfo: SubInfo, language: string) => {
    if (!subInfo) {
      return;
    }

    mutationDownload.mutate({ referer: subInfo.referer, link: subInfo.link, language} );
  };

  const handleSubtitleAction = (subtitle: Subtitle) => {
    switch (subtitle.origin) {
      case 'External':
        break;
      case 'Internal':
        translate(subtitle.number);
        break;
      case 'Addic7ed':
        download(
          {
            referer: subtitle.referer,
            link: subtitle.link,
          },
          subtitle.language,
        );
        break;
    }
  };

  return (
    <ul>
      {data.map((subtitle) => (
        <li key={subtitle.uuid} onClick={() => handleSubtitleAction(subtitle)}>
          <SubtitleText
            subtitle={subtitle}
            isLoading={
              mutationTranslate.isPending || mutationDownload.isPending
            }
          />
        </li>
      ))}
    </ul>
  );
};

export default SubtitlesNode;
