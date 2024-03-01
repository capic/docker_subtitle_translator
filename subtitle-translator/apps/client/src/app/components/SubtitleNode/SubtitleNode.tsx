import SubtitleText from '../SubtitleText/SubtitleText';
import {
  Addic7edSubtitle,
  ExternalSubtitle,
  InternalSubtitle,
  SubInfo,
  Subtitle,
} from '@subtitle-translator/shared';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  subtitle: Subtitle;
}

const isInternalSubtitle = (
  subtitle: Subtitle,
): subtitle is InternalSubtitle => {
  return subtitle.origin === 'Internal';
};
const isExternalSubtitle = (
  subtitle: Subtitle,
): subtitle is ExternalSubtitle => {
  return subtitle.origin === 'External';
};
const isAddic7edSubtitle = (
  subtitle: Subtitle,
): subtitle is Addic7edSubtitle => {
  return subtitle.origin === 'Addic7ed';
};

const SubtitleNode = ({ subtitle }: Props) => {
  const mutationTranslate = useMutation({
    mutationFn: ({ number }: { number: number }) => {
      return axios.post('http://192.168.1.106:3333/api/subtitles/translate', {
        uuid: subtitle.uuid,
        number,
      });
    },
  });

  const mutationDownload = useMutation({
    mutationFn: ({
      referer,
      link,
      language,
    }: {
      referer: SubInfo['referer'];
      link: SubInfo['link'];
      language: string;
    }) => {
      return axios.post('http://192.168.1.106:3333/api/subtitles/download', {
        uuid: subtitle.uuid,
        referer,
        link,
        language,
      });
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
