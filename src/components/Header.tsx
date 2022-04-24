import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RocketIcon from '@mui/icons-material/Rocket';

import {Store} from '../store/store-reducer';
import * as utils from '../helpers/utils';
import * as config from '../config/config';

// These are the wallet SDK helpers
import * as walletMetamask from '../helpers/wallet-metamask';

import {updateQueryResultsAction, updateRefreshingAction, updateWalletAction} from '../store/actions';
import {defaultQueryResults} from '../store/interfaces';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface IProps {}

const Header: React.FC<IProps> = () => {
  const {dispatch} = React.useContext(Store);

  const handleConnect = React.useCallback(async () => {
    updateRefreshingAction(dispatch, {
      status: true,
      message: 'Connecting wallet...',
    });
    let newWallet: any = await walletMetamask.connect();
    updateWalletAction(dispatch, newWallet);
    // If wallet is connected, query the blockchain and update stored values
    if (newWallet.connected) {
      Promise.all([
        Object.values(config.TOKENS).map(async (token: any) => {
          if (!token.address) {
            const croBalance = await utils.getCroBalance(newWallet.serverWeb3Provider, newWallet.address);
            updateQueryResultsAction(dispatch, {
              ...defaultQueryResults,
              balance: croBalance,
              name: token.name,
            });
          } else {
            const balance = await utils.getBalance(newWallet.address, token.address, token.decimal);
            updateQueryResultsAction(dispatch, {
              ...defaultQueryResults,
              balance: balance,
              name: token.name,
            });
          }
        }),
      ]);
    }
    updateRefreshingAction(dispatch, {
      status: false,
      message: 'Complete',
    });
  }, [dispatch]);

  React.useEffect(() => {
    handleConnect()
  }, [handleConnect]);

  // const disconnectWallet = async () => {
  //   updateRefreshingAction(dispatch, {
  //     status: true,
  //     message: 'Disconnecting wallet...',
  //   });
  //   switch (state.wallet.walletProviderName) {
  //     case 'defiwallet':
  //       await state.wallet.wcConnector.deactivate();
  //       break;
  //     default:
  //   }
  //   updateRefreshingAction(dispatch, {
  //     status: false,
  //     message: 'Complete',
  //   });
  //   updateWalletAction(dispatch, {...defaultWallet});
  //   updateQueryResultsAction(dispatch, {...defaultQueryResults});
  // };

  return (
    <div>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" sx={{mr: 2}}>
              <RocketIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              My Dapp
            </Typography>
            {/* {renderLoginButton()} */}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Header;
