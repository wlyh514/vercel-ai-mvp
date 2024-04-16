'use client';

import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material';
import { useState } from 'react';

type Props = {
  text: string;
};
const CopyButton: React.FC<Props> = ({text}) => {
  const [retTimeout, setRetTimeout] = useState<number | null>(null);
  const copy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (retTimeout) {
          clearTimeout(retTimeout);
        }
        setRetTimeout(window.setTimeout(() => { setRetTimeout(null) }, 3000));
      });
  }

  return <Button variant='text' sx={{minWidth: '3em'}} onClick={copy}>
    { retTimeout ? <CheckIcon sx={{fontSize: '1em'}} /> : <ContentCopyIcon sx={{fontSize: '1em'}} /> }
  </Button>
}

export default CopyButton;