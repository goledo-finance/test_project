import { Box, Paper, Stack, Typography } from '@mui/material';

import { MainLayout } from 'src/layouts/MainLayout';
import { MoreTopPanel } from 'src/modules/more/MoreTopPanel';
import { ActionList } from 'src/modules/more/ActionList';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

import { ContentContainer } from '../src/components/ContentContainer';
import { LabelList } from './staking.staking';

export default function POLPage() {
  return (
    <>
      <MoreTopPanel />
      <ContentContainer>
        <Box sx={{ display: 'flex' }}>
          <Paper sx={{ flex: 1, p: 5 }}>
            <ActionList />
          </Paper>
          <Stack spacing={2.5} sx={{ width: '470px', ml: 5 }}>
            <Paper sx={{ p: 5 }}>
              <Box>
                <LabelList
                  arr={[
                    {
                      label: <Typography sx={{ fontWeight: 600 }}>Buyable CFX</Typography>,
                      value: (
                        <Stack spacing={1.5} alignItems="end">
                          <FormattedNumber
                            variant="main16"
                            symbol="CFX"
                            value={61.9202}
                            visibleDecimals={4}
                            symbolsColor="#111"
                          />
                          <FormattedNumber
                            sx={{ color: '#666' }}
                            variant="description"
                            symbol="usd"
                            value={920001.01}
                            visibleDecimals={2}
                            symbolsColor="#666"
                          />
                        </Stack>
                      ),
                    },
                  ]}
                />
              </Box>
            </Paper>
            <Paper sx={{ p: 5 }}>
              <Box>
                <LabelList
                  arr={[
                    {
                      label: (
                        <Stack spacing={4}>
                          <Typography sx={{ fontWeight: 600 }}>
                            Goledo Finance Treasury Information
                          </Typography>
                          <Typography sx={{ color: '#666' }}>
                            Total share of GoledoCFX in treasury
                          </Typography>
                        </Stack>
                      ),
                      value: (
                        <Stack spacing={4}>
                          <Box height={22} />
                          <FormattedNumber
                            variant="main14"
                            percent
                            value={0.8}
                            visibleDecimals={0}
                            symbolsColor="#111"
                          />
                        </Stack>
                      ),
                    },
                    {
                      label: <Typography sx={{ color: '#666' }}>GoledoCFX in treasury</Typography>,
                      value: (
                        <Stack spacing={1.5} alignItems="end">
                          <FormattedNumber
                            variant="description"
                            symbol="GoledoCFX"
                            value={61.9202}
                            visibleDecimals={4}
                            symbolsColor="#111"
                          />
                          <FormattedNumber
                            variant="description"
                            symbol="usd"
                            value={61.92}
                            visibleDecimals={2}
                            symbolsColor="#666"
                            sx={{ color: '#666' }}
                          />

                          <FormattedNumber
                            variant="description"
                            symbol="GoledoCFX"
                            value={61.9202}
                            visibleDecimals={4}
                            symbolsColor="#111"
                          />
                          <FormattedNumber
                            variant="description"
                            symbol="usd"
                            value={61.92}
                            visibleDecimals={2}
                            symbolsColor="#666"
                            sx={{ color: '#666' }}
                          />

                          <FormattedNumber
                            variant="description"
                            symbol="GoledoCFX"
                            value={61.9202}
                            visibleDecimals={4}
                            symbolsColor="#111"
                          />
                          <FormattedNumber
                            variant="description"
                            symbol="usd"
                            value={61.92}
                            visibleDecimals={2}
                            symbolsColor="#666"
                            sx={{ color: '#666' }}
                          />
                        </Stack>
                      ),
                    },
                    {
                      label: <Typography sx={{ color: '#666' }}>Total CFX sold</Typography>,
                      value: (
                        <Stack spacing={1.5} alignItems="end">
                          <FormattedNumber
                            variant="description"
                            symbol="CFX"
                            value={61.9202}
                            visibleDecimals={4}
                            symbolsColor="#111"
                          />
                          <FormattedNumber
                            variant="description"
                            symbol="usd"
                            value={61.92}
                            visibleDecimals={2}
                            symbolsColor="#666"
                            sx={{ color: '#666' }}
                          />
                        </Stack>
                      ),
                    },
                  ]}
                />
              </Box>
            </Paper>
          </Stack>
        </Box>
      </ContentContainer>
    </>
  );
}

POLPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
