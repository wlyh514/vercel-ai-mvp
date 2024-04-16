'use client';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy as prismStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CopyButton from '@/components/copyButton';

type Props = {
  lang: string,
  code: string,
}
const BORDER_RADIUS = '5px';
const CodeBlock: React.FC<Props> = ({ lang, code }) => {

  return <Box>
    <Box sx={{ 
      backgroundColor: blue[200], 
      m: 0, 
      borderRadius: `${BORDER_RADIUS} ${BORDER_RADIUS} 0 0`, 
      p: '.1em 0 .1em 1em',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Box><strong>{lang}</strong></Box>
      <Box>
        <CopyButton text={code}/>
      </Box>
    </Box>
    <SyntaxHighlighter 
      language={lang} 
      showLineNumbers={code.includes('\n')} 
      style={prismStyle} 
      customStyle={{ 
        margin: 0, 
        fontSize: '90%', 
        padding: '0.5em', 
        borderRadius: `0 0 ${BORDER_RADIUS} ${BORDER_RADIUS}`,
        width: '100%',
        overflow: 'auto'
    }}>
      {code}
    </SyntaxHighlighter>
  </Box>;
}

export default CodeBlock;
export type { Props as CodeBlockProps };