import SubtitleText from '../SubtitleText/SubtitleText';
import {
  Addic7edSubtitle,
  InternalSubtitle,
  SubInfo,
  Subtitle,
} from '@subtitle-translator/shared';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  subtitle: Subtitle;
  addSubtitle: (subtitle: Subtitle) => void;
}

const isInternalSubtitle = (
  subtitle: Subtitle,
): subtitle is InternalSubtitle => {
  return subtitle.origin === 'Internal';
};
const isAddic7edSubtitle = (
  subtitle: Subtitle,
): subtitle is Addic7edSubtitle => {
  return subtitle.origin === 'Addic7ed';
};

const SubtitleNode = ({ subtitle, addSubtitle }: Props) => {
  const mutationTranslate = useMutation<Subtitle, void, { number: number }>({
    mutationFn: ({ number }) => {
      return axios.post('http://192.168.1.106:3333/api/subtitles/translate', {
        uuid: subtitle.uuid,
        number,
      });
    },
    onSuccess: (data) => {
      addSubtitle(data);
    },
  });

  const mutationDownload = useMutation<
    Subtitle,
    void,
    {
      referer: SubInfo['referer'];
      link: SubInfo['link'];
      language: string;
    }
  >({
    mutationFn: ({ referer, link, language }) => {
      return axios.post('http://192.168.1.106:3333/api/subtitles/download', {
        uuid: subtitle.uuid,
        referer,
        link,
        language,
      });
    },
    onSuccess: (data) => {
      addSubtitle(data);
    },
  });

  const translate = () => {
    if (!isInternalSubtitle(subtitle)) {
      return;
    }

    mutationTranslate.mutate({ number: subtitle.number });
  };

  const download = () => {
    if (!isAddic7edSubtitle(subtitle)) {
      return;
    }

    mutationDownload.mutate({
      referer: subtitle.referer,
      link: subtitle.link,
      language: subtitle.language,
    });
  };

  const handleSubtitleAction = () => {
    switch (subtitle.origin) {
      case 'External':
        break;
      case 'Internal':
        translate();
        break;
      case 'Addic7ed':
        download();
        break;
    }
  };

  return (
    <li key={subtitle.uuid} onClick={handleSubtitleAction}>
      <SubtitleText
        subtitle={subtitle}
        isLoading={mutationTranslate.isPending || mutationDownload.isPending}
      />
    </li>
  );
};

export default SubtitleNode;
