import { Box, Typography, Stack } from '@mui/material';
// import styles from './page.module.css';

const items = [
  'Html/css',
  'Js/bootstrap',
  'react/next',
  'firebase',
  'typescript/express',
  'OpenAI/StripAI',
  'API server',
  'AWS',
  'vectors/langchain',
  'traditional ML',
];

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Box>
        <Box width="800px" height="100px" bgcolor="#f0f0f0" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h2" color="#333" textAlign="center">
            Pantry Item
          </Typography>
        </Box>
        <Stack width="800px" height="400px" spacing={2} overflow="auto">
          {items.map((item) => (
            <Box
              key={item}
              width="100%"
              height="100px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="#f0f0f0"
            >
              <Typography variant="h6" color="#333" textAlign="center" fontWeight="bold">
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
