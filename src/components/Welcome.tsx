import React from 'react';
import {Store} from '../store/store-reducer';

import {Box, Grid, Typography} from '@mui/material';
import Paper from '@mui/material/Paper';

import * as utils from '../helpers/utils';

interface IProps {}

const Welcome: React.FC<IProps> = () => {
  const {state} = React.useContext(Store);
  const results = utils.uniq(state.queryResults);

  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          m: 5,
          minHeight: '250px',
          // border: '1px dashed grey',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={0}>
          <Typography variant="h2" component="div" gutterBottom>
            Welcome
          </Typography>
          {/* {renderDropdown()} */}
          <Typography variant="body1" component="div" gutterBottom>
            Your Ethereum address: <b>{state.wallet.address ? state.wallet.address : 'Not connected'}</b>
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            Wallet provider:{' '}
            <b>{state.wallet.walletProviderName ? state.wallet.walletProviderName : 'Not connected'}</b>
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            Your balance:
          </Typography>
          <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
            {results?.map((item: any, index: number) => {
              if (!item.name) return null;
              return (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <h4>{item.name}</h4>
                  <h4>{item.balance}</h4>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Box>
    </div>
  );
};

export default Welcome;
